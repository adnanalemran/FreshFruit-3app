<?php

namespace App\Http\Controllers;

use App\Models\PFooter;
use Illuminate\Http\Request;

class PFooterController extends Controller
{
    public function index()
    {
        $data = PFooter::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $data
        ], 200);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'social' => 'required|string',
                'image' => 'nullable|file|max:10240',
            ]);
            $signature_name = null;
            if ($image = $request->file('image')) {
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move('Images', $signature_name);
            }
            $data = new PFooter();
            $data->title = $request->title;
            $data->description = $request->description;
            $data->address = $request->address;
            $data->social = $request->social;
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
            $data = PFooter::findOrFail($id);
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

    public function edit(PFooter $pFooter)
    {
        //
    }

    public function update(Request $request, $id)
    {
        try {
            $data = PFooter::findOrFail($id);

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'address' => 'required|string',
                'social' => 'required|string',
                'image' => 'nullable|file|max:10240',
            ]);

            // Handle new image upload if provided
            if ($image = $request->file('image')) {
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move('Images', $signature_name);
                // Delete old image if exists
                if ($data->image && file_exists(public_path('Images/' . $data->image))) {
                    unlink(public_path('Images/' . $data->image));
                }
                $data->image = $signature_name;
            }

            // Update other fields
            $data->title = $request->title;
            $data->description = $request->description;
            $data->address = $request->address;
            $data->social = $request->social;
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
            $data = PFooter::findOrFail($id);

            // Delete image if exists
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
