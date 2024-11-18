import ReactDOM from "react-dom/client";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "../src/router/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from './redux/store';
import { Provider } from 'react-redux';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>


    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>  </Provider>
);
