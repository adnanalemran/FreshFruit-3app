// src/components/OrderAndPayment.js
import { useState, useEffect } from "react";

import OrderSummary from "./OrderSummary";
import PaymentForm from "./PaymentForm";

const OrderAndPayment = () => {
    const [cart, setCart] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        address: "",
    });


    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    return (
        <div>
            <OrderSummary userDetails={userDetails} setUserDetails={setUserDetails} cart={cart} />

            {/* <PaymentForm userDetails={userDetails} cart={cart} /> */}
        </div>
    );
};

OrderAndPayment.propTypes = {
    // cart is no longer passed as a prop
};

export default OrderAndPayment;
