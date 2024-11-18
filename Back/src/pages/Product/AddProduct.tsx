import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import http from "../../utils/http";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        status: 1,
        image: null,
    });

    const [fileError, setFileError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, files } = e.target as HTMLInputElement;

        setFormData((prevData) => ({
            ...prevData,
            [id]: id === "image" ? (files && files[0]) || null : value,
        }));

        if (id === "image" && files && files.length > 0) {
            setFileError(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            description: "",
            status: 1,
            image: null,
        });
        setFileError(null);
    };

    const { mutate, status } = useMutation({
        mutationFn: async (newItem: FormData) => {
            return http.post("/product/store", newItem, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            Swal.fire({
                title: "Success!",
                text: "Product added successfully!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/product/list");
            });
            resetForm();
        },
        onError: (e: any) => {
            const errorMessage = e?.response?.data?.error || "Something went wrong";
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.image) {
            setFileError("Please select a file.");
            return;
        } else {
            setFileError(null);
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("description", formData.description);
        data.append("status", formData.status.toString());
        if (formData.image) {
            data.append("image", formData.image);
        }

        mutate(data);
    };

    return (
        <div>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Add Product</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6.5">
                        {/* Product Name */}
                        <div className="mb-4.5">
                            <label htmlFor="name" className="mb-2.5 block text-black dark:text-white">
                                Product Name
                            </label>
                            <input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter product name"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Product Price */}
                        <div className="mb-4.5">
                            <label htmlFor="price" className="mb-2.5 block text-black dark:text-white">
                                Product Price ($)
                            </label>
                            <input
                                id="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                type="number"
                                placeholder="Enter product price"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Product Description */}
                        <div className="mb-4.5">
                            <label htmlFor="description" className="mb-2.5 block text-black dark:text-white">
                                Product Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter product description"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        {/* Product Image */}
                        <div className="mb-5.5">
                            <label htmlFor="image" className="mb-2.5 block text-black dark:text-white">
                                Product Image
                            </label>
                            <input
                                id="image"
                                type="file"
                                onChange={handleInputChange}
                                accept="image/*"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {fileError && <p className="text-red-500">{fileError}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                        >
                            {status === "pending" ? "Submitting..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
