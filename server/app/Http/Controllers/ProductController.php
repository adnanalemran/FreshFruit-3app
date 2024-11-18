<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Product::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Products retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Display only active products.
     */
    public function active()
    {
        $data = Product::where('status', 1)
            ->orderBy("id", "desc")
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Active products retrieved successfully',
            'data' => $data,
        ]);
    }
    public function deleteList()
    {
        $data = Product::where('status', 0)
            ->orderBy("id", "desc")
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Active products retrieved successfully',
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'description' => 'required|string',
                'image' => 'nullable|file|mimes:jpeg,png,jpg|max:10240',
            ]);

            $imageName = '';
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = uniqid() . '_' . $image->getClientOriginalName();
                $image->move(public_path('images'), $imageName);
            }

            $data = new Product();
            $data->name = $request->name;
            $data->price = $request->price;
            $data->description = $request->description;
            $data->status = $request->status ?? 1; // Default to active status if not provided
            $data->image = $imageName;
            $data->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully',
                'data' => $data,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = Product::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    /**
     * Toggle the status of the specified resource.
     */
    public function delete($id)
    {
        $data = Product::find($id);

        if (!$data) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found',
            ], 404);
        }

        $data->status = $data->status ? 0 : 1;
        $data->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Product status updated successfully',
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'price' => 'sometimes|required|numeric',
                'description' => 'sometimes|required|string',
                'image' => 'nullable|file|mimes:jpeg,png,jpg|max:10240',
                'status' => 'sometimes|boolean',
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = uniqid() . '_' . $image->getClientOriginalName();
                $image->move(public_path('images'), $imageName);
                $product->image = $imageName;
            }

            $product->fill($request->except('image'));
            $product->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully',
                'data' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
}
