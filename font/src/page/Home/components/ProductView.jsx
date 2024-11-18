import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async () => {
    try {
        const { data } = await axios.get("./products.json");
        console.log("Fetched Data:", data); // Debugging
        return data;
    } catch (error) {
        console.error("Error fetching products:", error); // Log error
        throw error; // Re-throw to let React Query handle it
    }
};

const ProductView = () => {
    const { data, isLoading, error } = useQuery(["products"], fetchProducts);
    console.log('fetchProducts', data)  //data not show
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Something went wrong!</p>;

    return (
        <div>
            <h1>Product List</h1>
            <div style={{ display: "flex", gap: "1rem" }}>
                {data.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "8px",
                        }}
                    >
                        <img src={product?.image} alt={product?.name} width="150" />
                        <h2>{product?.name}</h2>
                        <p>{product?.description}</p>
                        <p>${product?.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductView;
