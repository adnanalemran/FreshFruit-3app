<?php

namespace App\Http\Controllers;

use App\Models\SocialInfo;
use Illuminate\Http\Request;

class SocialInfoController extends Controller
{
    // Get the SocialInfo data
    public function show()
    {
        $socialInfo = SocialInfo::first();
        if (!$socialInfo) {
            return response()->json(['message' => 'No social information found'], 404);
        }
        return response()->json($socialInfo, 200);
    }

    // Store the SocialInfo data (only allow one record)
    public function store(Request $request)
    {

        try {
            // Check if the record already exists
            if (SocialInfo::exists()) {
                return response()->json(['message' => 'SocialInfo already exists, you can only update it'], 400);
            }

            // Validate the input
            $request->validate([
                'whatsapp' => 'nullable|string',
                'facebook' => 'nullable|string',
                'phone_no' => 'nullable|string',
            ]);

            // Create new SocialInfo record
            $socialInfo = SocialInfo::create($request->all());

            return response()->json($socialInfo, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e], 500);
        }
    }

    // Update the existing SocialInfo data
    public function update(Request $request)
    {
        $socialInfo = SocialInfo::first();

        if (!$socialInfo) {
            return response()->json(['message' => 'SocialInfo not found, please create it first'], 404);
        }

        // Validate the input
        $request->validate([
            'whatsapp' => 'nullable|string',
            'facebook' => 'nullable|string',
            'phone_no' => 'nullable|string',
        ]);


        // Update the SocialInfo record
        $socialInfo->update($request->all());

        return response()->json($socialInfo);
    }

    // Delete the SocialInfo (optional: can be restricted)
    public function destroy()
    {
        $socialInfo = SocialInfo::first();

        if (!$socialInfo) {
            return response()->json(['message' => 'No SocialInfo found to delete'], 404);
        }

        $socialInfo->delete();

        return response()->json(['message' => 'SocialInfo deleted successfully']);
    }
}
