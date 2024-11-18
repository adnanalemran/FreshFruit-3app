<?php

namespace App\Http\Controllers;

use App\Models\Proparty;
use Illuminate\Http\Request;

class PropartyController extends Controller
{

    public function index()
    {
        $data = Proparty::all();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        try {
            $data = Proparty::findOrFail($id);
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




    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|String|max:255',
                'status' =>  'required|string|max:255',
                'image' => 'nullable|file|max:10240', // 10MB max
            ]);

            if ($image = $request->file('image')) {
                $names = $image->getClientOriginalName();
                $signature_name = rand(11, 99999) . $names;
                $image->move('Images/', $signature_name);
            } else {
                $signature_name = "";
            }
            $data = new Proparty();
            $data->title = $request->title;
            $data->description = $request->description;
            $data->status = $request->status;
            $data->image = $signature_name;
            $data->save();
            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the data ',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $data = Proparty::findOrFail($id);

            $request->validate([
                'title' => 'nullable|string',
                'description' => 'nullable|string',

                'status' => 'required|string|max:255',
                'image' => 'nullable|file|max:10240',
            ]);

            $signature_name = $data->image; // Preserve old image if no new one is uploaded

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move(public_path('Images'), $signature_name);

                // Delete the old image if it exists
                if ($data->image && file_exists(public_path('Images/' . $data->image))) {
                    unlink(public_path('Images/' . $data->image));
                }
            }

            $data->title = $request->title;
            $data->description = $request->description;

            $data->status = $request->status;
            $data->image = $signature_name;

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
            // Find the service by ID
            $data = Proparty::findOrFail($id);

            // Delete the image if it exists
            if ($data->Image) {
                $imagePath = public_path('Images/' . $data->Image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
            $data->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
