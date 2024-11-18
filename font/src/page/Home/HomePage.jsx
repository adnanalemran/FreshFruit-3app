
import { Helmet } from "react-helmet";
import ProductView from "./components/ProductView";
import Cart from "./components/Cart";
const HomePage = () => {
    return (
        <div className="py-4">
            <Helmet>
                <title>Home || Task </title>
                <meta name="description" content="application" />
            </Helmet>

            <div className="flex min-h-[100vh]  ">
                <ProductView />
                <Cart />
            </div>


        </div>
    );
};

export default HomePage;