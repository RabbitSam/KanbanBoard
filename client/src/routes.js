import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import {SignUp, SignIn} from "./Pages/SignUpSignIn";
import Root from "./Pages/Root";
import SignOut from "./Pages/SignOut";
import Boards from "./Pages/Boards";


const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/sign-out",
                element: <SignOut />
            },
            {
                path: "/boards",
                element: <Boards />
            },
            {
                boards: "/boards/:boardId",
                element: <div></div>
            }
        ]
    },
    {
        path: "/sign-up",
        errorElement: <ErrorPage />,
        element: <SignUp />
    },
    {
        path: "/sign-in",
        errorElement: <ErrorPage />,
        element: <SignIn />
    }
]);

export default router;