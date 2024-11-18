<?php

namespace App\Http\Controllers;

use App\Models\DestinationInboxFile;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function index()
    {
        $data = DestinationInboxFile::orderBy("id", "desc")->get();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }
    public function show($id)
    {
        $destination = DestinationInboxFile::where('destination_id', $id)->get();
        if (!$destination) {
            return response()->json(['status' => 404, 'message' => 'Destination not found'], 404);
        }
        return response()->json(['status' => 200, 'data' => $destination], 200);
    }




    public function store(Request $request)
    {
        $request->validate([
            'destination_id' => 'required|string|max:255',
            'image' => 'nullable|file|image|max:10240',
        ]);


        $mainImageName = null;

        // Handle the main image upload
        if ($request->hasFile('image')) {
            $mainImage = $request->file('image');
            $mainImageName = uniqid() . '_' . $mainImage->getClientOriginalName();
            $mainImage->move(public_path('Images/external_image'), $mainImageName);
        }


        $destination = DestinationInboxFile::create([
            'destination_id' => $request->destination_id,
            'file_name' => $mainImageName,
        ]);


        return response()->json(['status' => 200, 'data' => $destination], 200);
    }







    public function destroy($id)
    {

        try {
            $imageName = DestinationInboxFile::findOrFail($id);
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
