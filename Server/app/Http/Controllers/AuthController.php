<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'gender' => 'required|string',
            'phone' => 'required|string',
            'address' => 'string',
            'image' => 'required|image|max:10240',
            'dob' => 'required|date',
            'role' => ' integer ',
        ]);

        try {
            $data['password'] = Hash::make($data['password']);

            // Create new user
            $user = new User();
            $user->name = $data['name'];
            $user->email = $data['email'];
            $user->password = $data['password'];
            $user->phone = $data['phone'];
            $user->address = $data['address'];
            $user->dob = $data['dob'];
            $user->gender = $data['gender'];
            $user->role = $data['role'];

            // Handle the main image upload
            if ($request->hasFile('image')) {
                $mainImage = $request->file('image');
                $mainImageName = uniqid() . '_' . $mainImage->getClientOriginalName();
                $mainImage->move(public_path('images'), $mainImageName);
                $user->image = $mainImageName;
            }

            $user->save();

            // Create token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User registration failed!',
                'error' => $e->getMessage(),
            ], 409);
        }
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|email|max:255|exists:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $data['email'])->first();

        // Check if the password matches
        if (!Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            
        ], 200);
    }
    public function updateUser(Request $request)
    {
        $authUser = $request->user();

        // Validation for updatable fields
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $authUser->id,
            'gender' => 'nullable|string',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:10240',
            'dob' => 'nullable|date',
        ]);

        try {
            // Find the user by ID
            $user = User::findOrFail($authUser->id);

            // Update user data dynamically, excluding the password
            $user->fill($data);

            if ($image = $request->file('image')) {
                // Generate a unique name for the image
                $signature_name = uniqid() . '_' . $image->getClientOriginalName();
                $image->move('Images', $signature_name);

                // Delete the old image if it exists
                if ($user->image && file_exists(public_path('Images/' . $user->image))) {
                    unlink(public_path('Images/' . $user->image));
                }

                // Update with new image
                $user->image = $signature_name;
            }
            // Save the user
            $user->save();

            // Generate a new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user!',
                'error' => $e->getMessage(),
            ], 200);
        }
    }

    public function getUserInfo(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Return the user's information
        return response()->json([
            'user' => $user,
        ], 200);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}
