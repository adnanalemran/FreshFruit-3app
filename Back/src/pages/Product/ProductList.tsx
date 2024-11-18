import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../../utils/http";
import { ImageUrl } from '../../utils/ImageUrl';
import Swal from "sweetalert2"; // Import SweetAlert2
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const ProductList = () => {
    const queryClient = useQueryClient();

    const { data: products = [], isLoading, isError, error } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const res = await http.get("/product");
            return res.data.data; // Ensure your API response has a structure like { data: { data: [...] } }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (productId: string | number) => {
            return http.delete(`/product/${productId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            queryClient.invalidateQueries({ queryKey: ["product-delete-list"] });
            Swal.fire("Deleted!", "The product has been deleted.", "success"); // SweetAlert2 success notification
        },
        onError: (e: any) => {
            const errorMessage = e?.response?.data?.error || "Something went wrong";
            Swal.fire("Error", errorMessage, "error"); // SweetAlert2 error notification
        },
    });

    const handleDelete = (productId: string | number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This Going On recycle been and its not show Website !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545", // Red for danger
            cancelButtonColor: "#6c757d", // Gray for cancel
            background: "#f8f9fa", // Light background
            color: "#212529", // Dark text color
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(productId);
            }
        });
    };

    if (isLoading) {
        return <div>Loading...</div>; // Display a loading message or spinner
    }

    if (isError) {
        return <div>Error: {error?.message}</div>; // Display an error message if there's an issue with the query
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Product List</h4>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Image</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Name</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Price</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Description</h5>
                    </div>

                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
                    </div>
                </div>

                {products.map((product: { id: Key | null | undefined; image: any; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, index: number) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-5 ${index === products.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                            }`}
                        key={product.id} // Ensure that you have a unique identifier for each product
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <div className="flex-shrink-0">
                                <img className="w-16 rounded-full" src={`${ImageUrl}${product?.image}`} alt="Product" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="hidden text-black dark:text-white sm:block font-bold">{product?.name}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">${product?.price}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-meta-3">{typeof product?.description === 'string' ? product.description.split(' ').slice(0, 10).join(' ') : ''}</p>
                        </div>

                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                            <button onClick={() => product.id && handleDelete(product.id as string | number)} className="  text-danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
