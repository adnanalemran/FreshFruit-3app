<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $data = Review::all();
        return response()->json([
            'status' => 'success',
            'message' => ' Request retrieved successfully',
            'data' => $data
        ]);
    }



    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'rating' => 'required|String|max:255',
                'status' =>  'required|string|max:255',
                'platform' => 'required|string|max:255',
                'review' => 'required|string|max:255',

            ]);
            $data = new Review();
            $data->name = $request->name;
            $data->ratings = $request->rating;
            $data->status = $request->status;
            $data->review = $request->review;
            $data->platform = $request->platform;
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
    public function show($id)
    {
        try {
            $data = Review::findOrFail($id);
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        try {
            $data = Review::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'rating' => 'required|String|max:255',
                'status' =>  'required|string|max:255',
                'platform' => 'required|string|max:255',
                'review' => 'required|string|max:255',
            ]);


            $data->name = $request->name;
            $data->ratings = $request->rating;
            $data->status = $request->status;
            $data->review = $request->review;
            $data->platform = $request->platform;
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Find the service by ID
            $data = Review::findOrFail($id);
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
