import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import Home from "./Pages/Home";
import {SignUp, SignIn} from "./Pages/SignUpSignIn";
import Root from "./Pages/Root";
import { rootLoader } from "./Loaders/Root";
import SignOut from "./Pages/SignOut";
import { boardsAction, boardContainerLoader, boardsLoader, boardContainerAction } from "./Loaders/Board";
import BoardContainer from "./Pages/BoardContainer";
import { signUpAction } from "./Loaders/SignUp";
import SignUpSuccess from "./Pages/SignUpSuccess";
import { signInAction } from "./Loaders/SignIn";
import { signOutAction } from "./Loaders/SignOut";

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <Root />,
        loader: rootLoader,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: boardsLoader,
                action: boardsAction,
                errorElement: <ErrorPage />
            },
            {
                path: "/sign-up/success",
                element: <SignUpSuccess />
            },
            {
                path: "/sign-out",
                element: <SignOut />,
                loader: signOutAction
            },
            {
                path: "/boards/:boardId",
                element: <BoardContainer />,
                loader: boardContainerLoader,
                errorElement: <ErrorPage />,
                action: boardContainerAction
            },
        ]
    },
    {
        path: "/sign-up",
        errorElement: <ErrorPage />,
        element: <SignUp />,
        action: signUpAction
    },
    {
        path: "/sign-in",
        errorElement: <ErrorPage />,
        element: <SignIn />,
        action: signInAction
    }
]);

export default router;