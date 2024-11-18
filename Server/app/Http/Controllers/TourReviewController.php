<?php

namespace App\Http\Controllers;

use App\Models\TourReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TourReviewController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'review' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $userId = Auth::id();
        // Check if the user has already reviewed the package
        $existingReview = TourReview::where('user_id', $userId)
            ->where('package_id', $request->package_id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this package.'], 400);
        }

        // Create the review
        $review = TourReview::create([
            'user_id' => $userId,
            'package_id' => $request->package_id,
            'review' => $request->review,
            'rating' => $request->rating,
        ]);

        return response()->json(['message' => 'Review submitted successfully', 'review' => $review], 201);
    }

    public function getReviewsByPackage($packageId)
    {
        // Fetch reviews for the given package, including related user and package data
        $reviews = TourReview::with(['user', 'package'])
            ->where('package_id', $packageId)
            ->orderBy('created_at', 'desc')
            ->get();

        // If no reviews are found
        if ($reviews->isEmpty()) {
            return response()->json(['message' => 'No reviews found for this package'], 404);
        }

        // Calculate the average rating for the package
        $averageRating = $reviews->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 2)  // Round to 2 decimal places
        ]);
    }


    public function getUserReviews()
    {
        // Fetch reviews made by the authenticated user
        $userReviews = TourReview::with(['user', 'package'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        if ($userReviews->isEmpty()) {
            return response()->json(['message' => 'No reviews found for the user'], 404);
        }

        return response()->json(['reviews' => $userReviews]);
    }

    public function getAllReviews()
    {
        // Fetch all reviews
        $reviews = TourReview::with(['user', 'package'])
            ->orderBy('created_at', 'desc')
            ->all();

        if ($reviews->isEmpty()) {
            return response()->json(['message' => 'No reviews found'], 404);
        }
        return response()->json(['reviews' => $reviews]);
    }
    public function checkReviewAvailability($packageId)
    {
        $reviewExists = TourReview::where('user_id', Auth::id())
            ->where('package_id', $packageId)
            ->exists();
        if ($reviewExists) {
            return response()->json(['review_available' => 0]);
        }
        return response()->json(['review_available' => 1]);
    }
}
