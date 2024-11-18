
import { Helmet } from "react-helmet";
import ProductView from "./components/ProductView";
import Cart from "./components/Cart";
const HomePage = () => {
    return (
        <div className="py-4">
            <Helmet>
                <title>Home || FreshFruit </title>
                <meta name="description" content="application" />
            </Helmet>

            <div className="grid gap-4 grid-cols-12 min-h-[100vh]  w-full lg:px-6 px-4">
                <div className=" col-span-8 ">
                    <ProductView />
                </div>
                <div className="col-span-4 ">
                    <Cart />
                </div>



            </div>


        </div>
    );
};

export default HomePage;