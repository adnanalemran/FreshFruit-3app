// src/components/PaymentForm.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { clearCart } from "../../redux/cartSlice";

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51Q1N7oGuW2mtyiOD9FAD9tAqcK093QCqtMb8x4kCkolyaDQe3iTgFEa0rLFaqVZVpSeLjDxh3hqDgV14HcqTH77400MI2tctAG");

const PaymentForm = ({ userDetails, cart }) => {

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Convert to cents

            const response = await axios.post("/api/create-payment-intent", { amount: totalAmount });
            const { clientSecret, error: createError } = response.data;

            if (createError) {
                console.error("Error creating payment intent:", createError);
                setIsProcessing(false);
                return;
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: userDetails,
                },
            });

            if (error) {
                console.error("Payment failed:", error);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                const orderResponse = await axios.post("/api/create-order", {
                    products: cart,
                    userDetails,
                    paymentIntentId: paymentIntent.id,
                    totalAmount: totalAmount / 100, // Convert back to dollars
                });

                if (orderResponse.data.success) {
                    dispatch(clearCart());  // Clear the cart in Redux
                }
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="card" className="block text-sm font-medium text-gray-700">
                    Card Information
                </label>
                <CardElement />
            </div>

            <button
                type="submit"
                className="mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg"
                disabled={!stripe || !elements || isProcessing}
            >
                {isProcessing ? "Processing..." : "Complete Order"}
            </button>
        </form>
    );
};

export default PaymentForm;
