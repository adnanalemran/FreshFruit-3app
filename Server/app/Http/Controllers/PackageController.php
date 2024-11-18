<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Package;
use App\Models\PackageFile;
use App\Models\TourPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class PackageController extends Controller
{
    public function index()
    {
        $data = Package::with('destination')
            ->orderBy("id", "desc")
            ->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function active()
    {
        $data = Package::with('destination')
            ->orderBy("id", "desc")
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function searchActive(Request $request)
    {
        $searchTerm = $request->input('search');

        $data = Package::with('destination')
            ->where('status', 1) // Only active packages
            ->where(function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('description', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('subtitle', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhereHas('destination', function ($q) use ($searchTerm) {
                        $q->where('title', 'LIKE', '%' . $searchTerm . '%'); // Assuming destination has a 'name' field
                    });
            })
            ->orderBy("id", "desc")
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Search results retrieved successfully',
            'data' => $data
        ]);
    }



    public function toggleStatus($id)
    {
        $destination = Package::find($id);
        if (!$destination) {
            return response()->json([
                'status' => 404,
                'message' => 'not found'
            ], 404);
        }

        $destination->status = $destination->status ? 0 : 1;
        $destination->save();
        return response()->json([
            'status' => 200,
            'message' => 'updated successfully',
            'data' => $destination
        ], 200);
    }

    public function show($id)
    {
        $Package = Package::with('packageFiles', 'tourPlans', 'destination')->find($id);
        return response()->json(['status' => 200, 'data' => $Package], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'subtitle' => 'required|string',
            'departure' => 'required|string',
            'day' => 'required|integer',
            'age' => 'required|integer',
            'parson' => 'required|string',
            'departureTime' => 'required|string',
            'returnTime' => 'required|string',
            'Included' => 'required|string',
            'destination' => 'required|integer',
            'tourPlans' => 'required|json',
            'image' => 'nullable|image|max:10240',
            'images.*' => 'nullable|image|max:10240',
        ]);

        $package = Package::create($request->except('tourPlans', 'image', 'Images'));

        // Handle tour plans
        $tourPlans = json_decode($request->input('tourPlans'), true); // Decode JSON to array
        if (is_array($tourPlans)) {
            foreach ($tourPlans as $plan) {
                TourPlan::create([
                    'package_id' => $package->id,
                    'plan_title' => $plan['planTitle'] ?? 'Optional Title',
                    'plan_description' => $plan['planDescription'] ?? 'Optional Description',
                ]);
            }
        } else {
            Log::error('Invalid tour plans JSON.');
        }

        // Handle destination association
        if ($request->has('destination')) {
            $destination = Destination::find($request->input('destination_id'));
            if ($destination) {
                $package->destination()->associate($destination);
                $package->save();
            }
        }
        if ($request->hasFile('image')) {
            $mainImage = $request->file('image');
            $mainImageName = uniqid() . '_' . $mainImage->getClientOriginalName();
            $mainImage->move(public_path('Images'), $mainImageName);
            $package->main_image = $mainImageName;
        }
        $package->save();
        $images = [];
        if ($request->hasFile('Images')) {
            foreach ($request->file('Images') as $image) {
                $imageName = time() . rand(11, 99999) . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('Images/external_image'), $imageName);
                $images[] = [
                    'package_id' => $package->id,
                    'file_name' => $imageName,
                    'title' => 'Optional Title',
                ];
            }
            PackageFile::insert($images);
        }
        return response()->json(['message' => 'Package created successfully!'], 201);
    }

    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        if (!$package) {
            return response()->json(['status' => 404, 'message' => 'Destination not found'], 404);
        }

        // Validation
        $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'required|string',
            'subtitle' => 'required|string',
            'departure' => 'required|string',
            'day' => 'required|integer',
            'age' => 'required|integer',
            'parson' => 'required|string',
            'departureTime' => 'required|string',
            'returnTime' => 'required|string',
            'Included' => 'required|string',
            'main_image' => 'nullable|file|image|max:10240', // Main image (optional)
        ]);

        try {

            $package->title = $request->title;
            $package->price = $request->price;
            $package->description = $request->description;
            $package->subtitle = $request->subtitle;
            $package->departure = $request->departure;
            $package->day = $request->day;
            $package->age = $request->age;
            $package->parson = $request->parson;
            $package->departureTime = $request->departureTime;
            $package->returnTime = $request->returnTime;
            $package->Included = $request->Included;

            // Handle the main image update
            if ($mainImageName = $request->file('main_image')) {
                $image_name = uniqid() . '_' . $mainImageName->getClientOriginalName();
                $mainImageName->move(public_path('Images'), $image_name);
                if ($package->main_image && file_exists(public_path('Images' . $package->$mainImageName))) {
                    unlink(public_path('Images/' . $package->main_image));
                }
                $package->main_image = $image_name;
            }
            $package->save();
            return response()->json(['status' => 200, 'message' => 'Package  updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $package = Package::find($id);
        if ($package->main_image && file_exists(public_path('Images/' . $package->main_image))) {
            unlink(public_path('Images/' . $package->main_image)); // Delete the main image using unlink
        }
        TourPlan::where('package_id', $package->id)->delete();
        $inboxFiles = PackageFile::where('package_id', $id)->get();
        foreach ($inboxFiles as $file) {
            $imagePath = public_path('Images/external_image') . '/' . $file->file_name;
            if (file_exists($imagePath)) {
                unlink($imagePath); // Delete each image
            }
        }
        PackageFile::where('package_id', $id)->delete();
        $package->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Package and its associated data deleted successfully',
        ], 200);
    }
}
