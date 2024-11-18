import { useQuery } from "@tanstack/react-query";
import http from "../../../utils/http";
import { useState } from "react";
import { ImageUrl } from '../../../utils/ImageUrl';
import Cart from "./Cart";

const ProductView = () => {
    const { data: products = [], isLoading, isError, error } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const res = await http.get("/product");
            return res.data.data; // Ensure your API response has a structure like { data: { data: [...] } }
        },
    });

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));

    const handleAddToCart = (product) => {
        const updatedCart = [...cart];
        const existingProduct = updatedCart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart); // Update state after updating localStorage
    };

    if (isLoading) {
        return <div className="text-center text-gray-600">Loading products...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-500">Error loading products: {error?.message}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Product List</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300"
                    >
                        <img
                            src={`${ImageUrl}${product?.image}`}
                            alt={product?.name}
                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{product?.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            {product?.description.split(' ').slice(0, 15).join(' ')}...
                        </p>
                        <p className="text-lg font-semibold text-blue-600">${parseFloat(product?.price).toFixed(2)}</p>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            <Cart />
        </div>
    );
};

export default ProductView;
