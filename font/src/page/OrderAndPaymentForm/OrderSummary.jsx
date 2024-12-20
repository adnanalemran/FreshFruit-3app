// src/components/OrderSummary.js
import PropTypes from 'prop-types';


const OrderSummary = ({ cart }) => {

    const calculateTotal = () => {
        return cart?.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="  mx-auto p-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Order Summary</h2>

            {/* User Information */}


            {/* Cart Items */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Cart Items</h3>
                <ul>
                    {cart?.map((item) => (
                        <li key={item.id} className="flex justify-between mb-2">
                            <span>{item.name}</span>
                            <span>{`$${item.price.toFixed(2)} x ${item.quantity}`}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total */}
            <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{`$${calculateTotal().toFixed(2)}`}</span>
                </div>
            </div>
        </div>
    );
};
OrderSummary.propTypes = {
    userDetails: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        address: PropTypes.string,
    }).isRequired,
    setUserDetails: PropTypes.func.isRequired,
    cart: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            price: PropTypes.number,
            quantity: PropTypes.number,
        })
    ).isRequired,
};

export default OrderSummary;

