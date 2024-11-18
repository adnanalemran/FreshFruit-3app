<?php

namespace App\Http\Controllers;

use App\Models\PHeader;
use Illuminate\Http\Request;

class PHeaderController extends Controller
{
    public function index()
    {
        $data = PHeader::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ], 200);
    }


    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'hotlineNo' => 'required|string',
                'image' => 'nullable|file|max:10240',
            ]);
            $signature_name = null;
            if ($image = $request->file('image')) {
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move('Images', $signature_name);
            }
            $data = new PHeader();
            $data->name = $request->name;
            $data->hotlineNo = $request->hotlineNo;
            $data->image = $signature_name;
            $data->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Data saved successfully',
                'data' => $data
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the data',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function show($id)
    {
        try {
            $data = PHeader::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Data retrieved successfully',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $data = PHeader::findOrFail($id);

            // Validate input
            $request->validate([
                'name' => 'string|max:255',
                'hotlineNo' => 'required|string',
                'image' => 'nullable|file|max:10240',
            ]);

            // Check if a new image is uploaded
            if ($image = $request->file('image')) {
                // Generate a unique name for the image
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move('Images', $signature_name);

                // Delete the old image if it exists
                if ($data->image && file_exists(public_path('Images/' . $data->image))) {
                    unlink(public_path('Images/' . $data->image));
                }

                // Update with new image
                $data->image = $signature_name;
            }

            // Update other fields
            $data->name = $request->name;
            $data->hotlineNo = $request->hotlineNo;

            // Save the changes
            $data->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Data updated successfully',
                'data' => $data
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $data = PHeader::findOrFail($id);

            // Use unlink to delete the image file
            if ($data->image && file_exists(public_path('Images/' . $data->image))) {
                unlink(public_path('Images/' . $data->image));
            }

            $data->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Data deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
