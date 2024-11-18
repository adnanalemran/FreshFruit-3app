// src/components/PaymentForm.js
import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import { clearCart } from "../../redux/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import http from "../../utils/http";
import { useNavigate } from "react-router-dom";

// Initialize Stripe with your public key
const stripePromise = loadStripe("pk_test_51Q1N7oGuW2mtyiOD9FAD9tAqcK093QCqtMb8x4kCkolyaDQe3iTgFEa0rLFaqVZVpSeLjDxh3hqDgV14HcqTH77400MI2tctAG");

const CheckoutForm = ({ userDetails, cart, onSuccess }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(userDetails);

    const isUserInfoValid = () => {
        return userInfo?.name && userInfo?.email && userInfo?.address;
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

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

            const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: userInfo,
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
                    userDetails: userInfo,
                    paymentIntentId: paymentIntent.id,
                    totalAmount: totalAmount / 100,
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
        <form className="bg-slate-100 p-6 rounded-xl my-8" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-neutral-700 pt-4">Payment Information</h3>
            <hr className="my-4 border-neutral-200" />

            {/* User Information Section */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-neutral-500">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo?.name}
                        onChange={handleUserInfoChange}
                        className="w-full p-2 rounded-md border border-neutral-300"
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label className="block text-sm text-neutral-500">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userInfo?.email}
                        onChange={handleUserInfoChange}
                        className="w-full p-2 rounded-md border border-neutral-300"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label className="block text-sm text-neutral-500">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={userInfo?.address}
                        onChange={handleUserInfoChange}
                        className="w-full p-2 rounded-md border border-neutral-300"
                        placeholder="Enter your address"
                    />
                </div>
            </div>

            {/* Card Information Section */}
            <div className="mt-6">
                <label className="block text-sm text-neutral-500">Card Info:</label>
                <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-200 my-4">
                    <CardElement options={{ style: { base: { fontSize: "18px", color: "#333" }, invalid: { color: "#fa755a" } } }} />
                </div>
            </div>

            <button
                type="submit"
                className={`w-full px-5 py-2.5 rounded-lg text-sm text-white ${loading ? "bg-neutral-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
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
    const navigate = useNavigate()

    const handleSuccess = () => {
        dispatch(clearCart());  // Clear the cart in Redux after successful order
        navigate('/');
        Swal.fire({
            title: "Order Placed!",
            text: "Your order has been placed successfully.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
    };

    return (
        <div className="mx-auto w-full max-w-lg">
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
