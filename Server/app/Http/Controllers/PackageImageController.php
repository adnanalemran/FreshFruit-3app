<?php

namespace App\Http\Controllers;

use App\Models\DestinationInboxFile;
use App\Models\PackageFile;
use Illuminate\Http\Request;

class PackageImageController extends Controller
{
    public function index()
    {

        $data = PackageFile::orderBy("id", "desc")->get();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $destination = PackageFile::where('package_id', $id)->get();
        if (!$destination) {
            return response()->json(['status' => 404, 'message' => '  not found'], 404);
        }
        return response()->json(['status' => 200, 'data' => $destination], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|string|max:255',
            'file_name' => 'nullable|file|image|max:10240',
        ]);
        $mainImageName = null;
        // Handle the main image upload
        if ($request->hasFile('file_name')) {
            $mainImage = $request->file('file_name');
            $mainImageName = uniqid() . '_' . $mainImage->getClientOriginalName();
            $mainImage->move(public_path('Images/external_image'), $mainImageName);
        }
        $package = PackageFile::create([
            'package_id' => $request->package_id,
            'file_name' => $mainImageName,
        ]);

        return response()->json(['status' => 200, 'data' => $package], 200);
    }

    public function destroy($id)
    {

        try {
            $imageName = PackageFile::findOrFail($id);
            if (!$imageName) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Destination not found'
                ], 404);
            }
            if ($imageName->file_name) {
                $imagePath = public_path('Images/external_image/' . $imageName->file_name);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            $imageName->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
