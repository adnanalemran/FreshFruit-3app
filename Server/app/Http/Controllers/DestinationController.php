<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\DestinationInboxFile;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    /**
     * Display a listing of all destinations.
     */
    public function index()
    {
        $data = Destination::orderBy("id", "desc")->get();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }
    public function active()
    {
        // Retrieve only the records where status is 1
        $data = Destination::where('status', 1)
            ->orderBy("id", "desc")
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function toggleStatus($id)
    {
        $destination = Destination::find($id);
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
            'message' => 'Destination status updated successfully',
            'data' => $destination
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'description2' => 'nullable|string',
            'image' => 'nullable|file|image|max:10240',
            'images.*' => 'nullable|file|image|max:10240',
        ]);


        try {
            // Store the destination
            $destination = new Destination();
            $destination->title = $request->title;
            $destination->title = $request->title;
            $destination->description = $request->description;
            $destination->description2 = $request->description2;

            // Handle the main image upload
            if ($request->hasFile('image')) {
                $mainImage = $request->file('image');
                $mainImageName = uniqid() . '_' . $mainImage->getClientOriginalName();
                $mainImage->move(public_path('Images'), $mainImageName);
                $destination->image = $mainImageName;
            }

            $destination->save();

            // Handle multiple image uploads
            $images = [];

            if ($request->hasFile('Images')) {
                foreach ($request->file('Images') as $image) {
                    $imageName = time() . rand(11, 99999) . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('Images/external_image'), $imageName);
                    $images[] = [
                        'destination_id' => $destination->id,
                        'file_name' => $imageName,
                        'title' => 'Optional Title', // Can be dynamic if provided in request
                    ];
                }
                DestinationInboxFile::insert($images);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Destination created successfully',
                'data' => $destination
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified destination by ID.
     */
    public function show($id)
    {
        $destination = Destination::with('inboxFiles')->find($id);

        if (!$destination) {
            return response()->json(['status' => 404, 'message' => 'Destination not found'], 404);
        }
        return response()->json(['status' => 200, 'data' => $destination], 200);
    }

    /**
     * Update the specified destination in storage.
     */
    public function update(Request $request, $id)
    {
        $destination = Destination::findOrFail($id);

        if (!$destination) {
            return response()->json(['status' => 404, 'message' => 'Destination not found'], 404);
        }

        // Validation
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'description2' => 'nullable|string',
            'image' => 'nullable|file|image|max:10240', // Main image (optional)
        ]);

        try {
            // Update the fields
            $destination->title = $request->title;
            $destination->description = $request->description;
            $destination->description2 = $request->description2;

            // Handle the main image update
            if ($image = $request->file('image')) {
                $image_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move(public_path('Images'), $image_name);

                // Delete old image if it exists
                if ($destination->image && file_exists(public_path('Images/' . $destination->image))) {
                    unlink(public_path('Images/' . $destination->image));
                }

                // Update image field
                $destination->image = $image_name;
            }

            // Save the updated destination
            $destination->save();

            return response()->json(['status' => 200, 'message' => 'Destination updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }



    /**
     * Remove the specified destination and its associated images from storage.
     */
    public function destroy($id)
    {
        $destination = Destination::find($id);
        if (!$destination) {
            return response()->json(['status' => 404, 'message' => 'Destination not found'], 404);
        }
        try {
            // Unlink the main image
            if ($destination->image) {
                $mainImagePath = public_path('Images') . '/' . $destination->image;
                if (file_exists($mainImagePath)) {
                    unlink($mainImagePath); // Delete the main image
                }
            }
            $inboxFiles = DestinationInboxFile::where('destination_id', $id)->get();

            foreach ($inboxFiles as $file) {
                $imagePath = public_path('Images/external_image') . '/' . $file->file_name;
                if (file_exists($imagePath)) {
                    unlink($imagePath); // Delete each image
                }
            }
            DestinationInboxFile::where('destination_id', $id)->delete();
            $destination->delete();
            return response()->json(['status' => 200, 'message' => 'Destination deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 500, 'message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
