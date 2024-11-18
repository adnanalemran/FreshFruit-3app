<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        // Get the amount from the frontend (this would typically be dynamic based on the cart total)
        $amount = $request->amount; // Example: $request->amount should be in cents, e.g., $50 = 5000 cents

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'usd',
            ]);

            return response()->json(['clientSecret' => $paymentIntent->client_secret]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // Endpoint to save the order to the database after payment
    public function createOrder(Request $request)
    {
        $userDetails = $request->userDetails;
        $products = $request->products;
        $paymentIntentId = $request->paymentIntentId;

        // Save the order to the database (you need to create an Order model and migration)
        // Example:
        $order = Order::create([
            'user_details' => json_encode($userDetails),
            'payment_intent_id' => $paymentIntentId,
            'total_amount' => $request->totalAmount,
            // Save product details
        ]);

        // You can also save the cart items in an order_items table if necessary
        // Example:
        foreach ($products as $product) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);
        }

        return response()->json(['success' => true, 'order' => $order]);
    }
}
