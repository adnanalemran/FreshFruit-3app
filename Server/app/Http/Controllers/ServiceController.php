<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Service::all();
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
                'Title' => 'required|string|max:255',
                'Description' => 'required|String|max:255',
                'url' => 'required|string|max:255',
                'Status' =>  'required|string|max:255',
                'image' => 'nullable|file|max:10240', // 10MB max
            ]);

            if ($Image = $request->file('Image')) {
                $names = $Image->getClientOriginalName();
                $signature_name = rand(11, 99999) . $names;
                $Image->move('Images/', $signature_name);
            } else {
                $signature_name = "";
            }

            $service = new Service();
            $service->Title = $request->Title;
            $service->Description = $request->Description;
            $service->url = $request->url;
            $service->Status = $request->Status;
            $service->Image = $signature_name;
            $service->save();

            return response()->json($service, 201);
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
             $data = Service::findOrFail($id);
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
             // Find the service by ID, throws exception if not found
             $data = Service::findOrFail($id);
     
             // Validate the incoming request
             $request->validate([
                 'Title' => 'required|string|max:255',
                 'Description' => 'required|string|max:255',
                 'url' => 'required|string|max:255',
                 'Status' => 'required|string|max:255',
                 'Image' => 'nullable|file|max:10240', // Optional image file with a max size of 10MB
             ]);
     
             // Preserve the old image if no new one is uploaded
             $signature_name = $data->Image;
     
             // Check if a new image is uploaded
             if ($request->hasFile('Image')) {
                 $Image = $request->file('Image');
                 $signature_name = uniqid() . '_' . $Image->getClientOriginalName();
                 $Image->move(public_path('Images'), $signature_name);
     
                 // Delete the old image if it exists
                 if ($data->Image && file_exists(public_path('Images/' . $data->Image))) {
                     unlink(public_path('Images/' . $data->Image));
                 }
             }
     
             // Update service fields
             $data->Title = $request->Title;
             $data->Description = $request->Description;
             $data->url = $request->url;
             $data->Status = $request->Status;
             $data->Image = $signature_name;
     
             // Save the updated service in the database
             $data->save();
     
             // Return success response
             return response()->json([
                 'status' => 'success',
                 'message' => 'Data updated successfully',
                 'data' => $data
             ], 200);
     
         } catch (\Exception $e) {
             // Log the error for debugging (optional)
             // Log::error($e);
     
             // Return error response
             return response()->json([
                 'status' => 'error',
                 'message' => 'An error occurred while updating the data',
                 'error' => $e->getMessage() // Optionally hide error details in production
             ], 500);
         }
     }
     
    public function destroy($id)
    {
        try {
            // Find the service by ID
            $service = Service::findOrFail($id);

            // Delete the image if it exists
            if ($service->Image) {
                $imagePath = public_path('Images/' . $service->Image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }


            $service->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
