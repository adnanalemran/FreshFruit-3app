// src/components/PaymentForm.js
import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { clearCart } from "../../redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import http from "../../utils/http";

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51Q1N7oGuW2mtyiOD9FAD9tAqcK093QCqtMb8x4kCkolyaDQe3iTgFEa0rLFaqVZVpSeLjDxh3hqDgV14HcqTH77400MI2tctAG");

const CheckoutForm = ({ userDetails, cart, onSuccess }) => {
    console.log('cart', userDetails);
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const isUserInfoValid = () => {
        // Check if name, email, and address are provided
        return userDetails?.name && userDetails?.email && userDetails?.address;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        // Check if user information is complete
        if (!isUserInfoValid()) {
            setErrorMessage("Please provide all user details (Name, Email, Address).");
            return;
        }

        setLoading(true);
        const cardElement = elements.getElement(CardElement);
        const { error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        try {
            const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0) * 100;

            const response = await http.post("/create-payment-intent", { amount: totalAmount });

            const { clientSecret } = response.data;

            // Confirm the payment
            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: userDetails,
                },
            });

            if (paymentError) {
                setErrorMessage(paymentError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                const orderResponse = await http.post("/create-order", {
                    products: cart,
                    userDetails,
                    paymentIntentId: paymentIntent.id,
                    totalAmount: totalAmount / 100, // Convert back to dollars
                });

                if (orderResponse.data.success) {
                    setErrorMessage(" ");
                    onSuccess(); // Callback after success
                }
            }
        } catch (error) {
            setErrorMessage("Payment failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <form className=" bg-slate-100 p-4 pb-6 rounded-xl   m-4 my-8" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-neutral-700 pt-4">Payment Information</h3>
            <hr className="my-4 border-neutral-200" />
            <label className="block text-sm text-neutral-500">Card info:</label>
            <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-200 my-4">
                <CardElement options={{ style: { base: { fontSize: "18px", color: "#333" }, invalid: { color: "#fa755a" } } }} />
            </div>

            <button
                type="submit"
                className={`block w-full px-5 py-2.5 rounded-lg text-sm text-white ${loading ? "bg-neutral-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
                disabled={!stripe || loading}
            >
                {loading ? "Processing..." : "Pay Now"}
            </button>

            {/* Error Message */}
            {errorMessage && <div className="text-red-600 mt-2">{errorMessage}</div>}
        </form>
    );
};

const PaymentForm = ({ userDetails, cart }) => {
    const dispatch = useDispatch();

    const handleSuccess = () => {
        dispatch(clearCart());  // Clear the cart in Redux after successful order
        Swal.fire({
            title: "Order Placed!",
            text: "Check your order details in the Profile History section.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutForm userDetails={userDetails} cart={cart} onSuccess={handleSuccess} />
            </Elements>
        </div>
    );
};

CheckoutForm.propTypes = {
    userDetails: PropTypes.object.isRequired,
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
    onSuccess: PropTypes.func.isRequired,
};

PaymentForm.propTypes = {
    userDetails: PropTypes.object.isRequired,
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            price: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default PaymentForm;
