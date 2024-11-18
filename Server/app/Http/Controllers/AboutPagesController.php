<?php

namespace App\Http\Controllers;

use App\Models\AboutPages;
use Illuminate\Http\Request;

class AboutPagesController extends Controller
{

    public function index()
    {
        $data = AboutPages::all();
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
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'status' =>  'required|string|max:255',
                'canvas' =>  'required|string',

            ]);


            $data = new AboutPages();
            $data->title = $request->title;
            $data->description = $request->description;
            $data->status = $request->status;
            $data->canvas = $request->canvas;

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
            $data = AboutPages::findOrFail($id);
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
            $data = AboutPages::findOrFail($id);

            $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'status' =>  'sometimes|string|max:255',
                'canvas' =>  'sometimes|string',
            ]);

            $data->title = $request->title;
            $data->description = $request->description;
            $data->status = $request->status;
            $data->canvas = $request->canvas;

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
            $data = AboutPages::findOrFail($id);

            // Delete the image if it exists
            if ($data->menuIcon) {
                $imagePath = public_path('Images/' . $data->menuIcon);
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
