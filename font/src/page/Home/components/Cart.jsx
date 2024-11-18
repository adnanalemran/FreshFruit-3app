import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../../../redux/cartSlice";
import { ImageUrl } from '../../../utils/ImageUrl';
import { Link } from "react-router-dom";

const Cart = () => {
    const cart = useSelector(state => state.cart); // Redux state
    const dispatch = useDispatch();

    const handleIncreaseQuantity = (productId) => {
        dispatch(increaseQuantity(productId)); // Increase quantity
    };

    const handleDecreaseQuantity = (productId) => {
        dispatch(decreaseQuantity(productId)); // Decrease quantity
    };

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId)); // Remove product from cart
    };

    // Calculate the total price of the cart
    const getTotalPrice = () => {
        return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-base-200 rounded-lg min-w-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Cart</h2>

            {cart.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <li className="flex flex-col py-4 sm:flex-row sm:justify-between border-b border-stone-500">
                                <div className="flex w-full space-x-2 sm:space-x-4">
                                    <img
                                        className="flex-shrink-0 object-cover w-20 h-20 dark:border- rounded outline-none sm:w-32 sm:h-32 dark:bg-gray-500"
                                        src={`${ImageUrl}${item?.image}`} alt={item?.name}
                                    />
                                    <div className="flex flex-col justify-between w-full pb-4">
                                        <div className="flex justify-between w-full pb-2 space-x-2">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold leading-snug sm:pr-8">{item?.name}</h3>
                                                <p className="text-sm dark:text-gray-600">{item?.description}</p>
                                            </div>
                                            <div className="text-right">
                                                {/* Display unit price and total price */}
                                                <p className="text-lg font-semibold">${(item?.quantity * item?.price).toFixed(2)}</p>
                                                <p className="text-sm dark:text-gray-400">Unit Price: ${item?.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-sm divide-x">
                                            <button type="button" className="flex items-center px-2 py-1 pl-0 space-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                                    <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
                                                    <rect width="32" height="200" x="168" y="216"></rect>
                                                    <rect width="32" height="200" x="240" y="216"></rect>
                                                    <rect width="32" height="200" x="312" y="216"></rect>
                                                    <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
                                                </svg>
                                                <span onClick={() => handleRemoveFromCart(item.id)}>Remove</span>
                                            </button>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-400"></p>
                ) : (
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="text-lg font-semibold">Total Price:</p>
                            <p className="text-lg font-semibold">${getTotalPrice().toFixed(2)}</p>
                        </div>
                        <Link to='/order-and-payment'>
                            <button className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300">
                                Proceed to Checkout
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
