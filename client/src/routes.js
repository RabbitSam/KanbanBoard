import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Root from "./Pages/Root";


const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    },
    {
        path: "/sign-up",
        errorElement: <ErrorPage />,
        element: <SignUp />
    }
]);

export default router;