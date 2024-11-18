<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Shop::all();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'discount' => 'required|String|max:255',
                'url' => 'required|string|max:255',
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

            $data = new Shop();
            $data->title = $request->title;
            $data->discount = $request->discount;
            $data->url = $request->url;
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
    /**
     * Display the specified resource.
     */
    public function show(Shop $shop)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shop $shop)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shop $shop)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Find the service by ID
            $data = shop::findOrFail($id);

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
