<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $request->validate(['amount' => 'required|numeric']);

        try {
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            // Convert the amount (e.g., 1.25 dollars) to cents (125)
            $amountInCents = (int)($request->amount * 100);

            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents, // Amount in cents
                'currency' => 'usd',
                'payment_method_types' => ['card'],
            ]);

            return response()->json(['clientSecret' => $paymentIntent->client_secret], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createOrder(Request $request)
    {
        $validatedData = $request->validate([
            'products' => 'required|array',
            'userDetails' => 'required|array',
            'paymentIntentId' => 'required|string',
            'totalAmount' => 'required|numeric',
        ]);

        try {
            $order = new Order();
            $order->client_name = $validatedData['userDetails']['name'];
            $order->client_email = $validatedData['userDetails']['email'];
            $order->client_address = $validatedData['userDetails']['address'];
            $order->total_bill = $validatedData['totalAmount'];
            $order->products = json_encode($validatedData['products']);
            $order->stripe_payment_id = $validatedData['paymentIntentId'];
            $order->payment_status = 'paid';
            $order->save();

            return response()->json(['success' => true, 'message' => 'Order created successfully!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function getAllOrders()
    {
        try {
            // Fetch all orders
            $orders = Order::all();

            // Return the orders as JSON
            return response()->json(['success' => true, 'orders' => $orders], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
