
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/animation/Animation1.json";
const ErrorPage = () => {
    return (
        <div>
            <section className="bg-white  ">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">

                        <Player
                            autoplay
                            loop
                            src={animationData}
                            style={{ height: "300px", width: "300px" }}
                        >
                            <Controls
                                visible={false}
                                buttons={["play", "repeat", "frame", "debug"]}
                            />
                        </Player>

                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-600 md:text-4xl dark:text-white">
                            Something's missing.
                        </p>
                        <p className="mb-4 text-lg font-light  text-gray-500">
                            Sorry, we can't find that page. You'll find lots to explore on the
                            home page.{" "}
                        </p>
                        <a
                            href="/"
                            className="inline-flex text-white bg-indigo-600 hover:bg-indigo-800  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                        >
                            Back to Homepage
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};



export default ErrorPage;