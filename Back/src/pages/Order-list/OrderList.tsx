import { useQuery } from "@tanstack/react-query";
import http from "../../utils/http";

import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

const OrderList = () => {
    const { data: ordersData, isLoading, isError, error } = useQuery({
        queryKey: ["getAllOrders"],
        queryFn: async () => {
            const res = await http.get("/getAllOrders");
            return res.data.orders; // Adjust based on your API response structure
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error?.message || "Something went wrong!"}</div>;
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Order List
            </h4>

            <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
                {/* Table */}
                <table className="min-w-full table-auto">
                    <thead className="sticky top-0 bg-gray-2 dark:bg-meta-4 z-10">
                        <tr>
                            <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Client Name</th>
                            <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Client Email</th>
                            <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Total Bill</th>
                            <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Client Address</th>
                            <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base  whitespace-nowrap">Order Date</th>
                            <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base whitespace-nowrap">Payment Id</th>
                            <th className="p-2.5 xl:p-5 text-center text-sm font-medium uppercase xsm:text-base whitespace-nowrap ">Product List</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Data Rows */}
                        {ordersData.map((order: { id: Key | null | undefined; client_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; client_email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; total_bill: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; client_address: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; created_at: string | number | Date; stripe_payment_id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; products: string; }) => (
                            <tr key={order.id} className="border-b border-stroke dark:border-strokedark">
                                <td className="p-2.5 xl:p-5 text-sm text-black dark:text-white">{order.client_name}</td>
                                <td className="p-2.5 xl:p-5 text-sm text-black dark:text-white">{order.client_email}</td>
                                <td className="p-2.5 xl:p-5 text-center text-sm text-black dark:text-white">${order.total_bill}</td>
                                <td className="p-2.5 xl:p-5 text-center text-sm text-black dark:text-white">{order.client_address}</td>
                                <td className="p-2.5 xl:p-5 text-center text-sm text-black dark:text-white">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-2.5 xl:p-5 text-center text-sm text-black dark:text-white">{order.stripe_payment_id}</td>
                                <td className="p-2.5 xl:p-5 text-center text-sm text-black dark:text-white">
                                    {/* Products List */}
                                    <ul className="text-sm text-black dark:text-white">
                                        {JSON.parse(order.products).map((product: { id: Key; name: string; price: number; quantity: number }) => (
                                            <li key={product.id}>
                                                {product.name} - ${product.price} x {product.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
