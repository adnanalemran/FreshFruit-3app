import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../../../redux/cartSlice";
import { ImageUrl } from '../../../utils/ImageUrl';

const Cart = () => {
    const cart = useSelector(state => state.cart); // Get cart from Redux state
    const dispatch = useDispatch();

    const handleIncreaseQuantity = (productId) => {
        dispatch(increaseQuantity(productId)); // Dispatch action to increase quantity
    };

    const handleDecreaseQuantity = (productId) => {
        dispatch(decreaseQuantity(productId)); // Dispatch action to decrease quantity
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId)); // Dispatch action to remove product from cart
    };

    const handleCheckout = () => {
        // Redirect to Stripe checkout or payment page
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Your Cart</h2>

            {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={`${ImageUrl}${item?.image}`}
                                    alt={item?.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{item?.name}</h3>
                                    <p className="text-sm text-gray-500">{item?.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleDecreaseQuantity(item.id)}
                                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="font-semibold text-lg">{item?.quantity}</span>
                                <button
                                    onClick={() => handleIncreaseQuantity(item.id)}
                                    className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="px-2 py-1 text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleCheckout}
                    className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
