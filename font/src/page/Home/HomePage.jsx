
import { Helmet } from "react-helmet";
import ProductView from "./components/ProductView";
const HomePage = () => {
    return (
        <div className="py-4">
            <Helmet>
                <title>My Title</title>
                <meta name="description" content="application" />
            </Helmet>


            <ProductView />
            <h1 className="text-3xl font-bold underline text-primary">

            </h1>
        </div>
    );
};

export default HomePage;