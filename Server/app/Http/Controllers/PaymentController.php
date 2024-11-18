<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'paymentMethodId' => 'required|string',
            'package_id' => 'required|exists:packages,id',
            'booking_date' => 'required',
            'amount' => 'required|integer',
        ]);

        // Set Stripe API Key
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $userId = Auth::id();

            // Create a PaymentIntent
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => 'usd',
                'payment_method' => $request->paymentMethodId,
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never',
                ],
                'description' => 'Tour package booking',
            ]);

            // Check for required actions
            if ($paymentIntent->status === 'requires_action') {
                return response()->json([
                    'requiresAction' => true,
                    'paymentIntentId' => $paymentIntent->id,
                ], 200);
            }

            // Save payment details in the database
            $payment = Payment::create([
                'user_id' => $userId,
                'package_id' => $request->package_id,
                'stripe_charge_id' => $paymentIntent->id,
                'amount' => $paymentIntent->amount,
                'status' => $paymentIntent->status,
                'booking_date' => $request->booking_date, // Ensure this is a valid format
            ]);

            return response()->json([
                'message' => 'Payment successful',
                'payment' => $payment,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            Log::error('Request data: ' . json_encode($request->all()));

            return response()->json(['error' => 'Payment failed: ' . $e->getMessage()], 500);
        }
    }



    public function userlistPayments()
    {
        // Get the authenticated user's ID
        $userId = Auth::id();

        // Retrieve all payments with related user and package information
        $payments = Payment::with(['user', 'package']) // Assuming you have these relationships defined in your models
            ->where('user_id', $userId) // Optionally filter by the authenticated user
            ->get();

        return response()->json($payments, 200);
    }


    public function listPayments()
    {

        $payments = Payment::with(['user', 'package'])->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Request retrieved successfully',
            'data' => $payments
        ], 200);
    }
}
