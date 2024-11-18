<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index()
    {
        $data = Slider::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ]);
    }

    public function create()
    {
        // Implementation needed if you plan to add a create form or logic
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'url' => 'nullable|url',
                'status' => 'string|max:255',
                'image' => 'nullable|file|max:10240', 
            ]);

            $signature_name = '';
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $signature_name = rand(11, 99999) . '_' . $image->getClientOriginalName();
                $image->move(public_path('Images'), $signature_name);
            }

            $data = new Slider();
            $data->title = $request->title;
            $data->description = $request->description;
            $data->url = $request->url;
            $data->status = $request->status;
            $data->image = $signature_name;
            $data->save();

            return response()->json($data, 201);
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
            $data = Slider::findOrFail($id);
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

    public function edit(Slider $slider)
    {
        // Implementation needed if you plan to add an edit form or logic
    }
    public function update(Request $request, $id)
    {
        try {
            $data = Slider::findOrFail($id);

            $request->validate([
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'url' => 'nullable|string',
                'status' => 'string|max:255',
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
            $data->url = $request->url;
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
            $data = Slider::findOrFail($id);

            // Delete the image if it exists
            if ($data->image && file_exists(public_path('Images/' . $data->image))) {
                unlink(public_path('Images/' . $data->image));
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
