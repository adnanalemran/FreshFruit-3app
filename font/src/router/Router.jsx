
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../page/Home/HomePage";

import ErrorPage from "../components/common/ErrorPage";
import LandingLayout from "../layout/LandingLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      }
    ],
  },
]);
