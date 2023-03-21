import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Pages/ErrorPage";
import Root from "./Pages/Root";
import Home from "./Pages/Home";
import {SignUp, SignIn} from "./Pages/SignUpSignIn";
import SignUpSuccess from "./Pages/SignUpSuccess";
import SignOut from "./Pages/SignOut";
import Boards from "./Pages/Boards";
import BoardContainer from "./Pages/BoardContainer";

import { rootLoader } from "./Loaders/Root";
import { HomeLoader } from "./Loaders/Home";
import { boardsAction, boardContainerLoader, boardsLoader, boardContainerAction } from "./Loaders/Board";
import { signUpAction } from "./Loaders/SignUp";
import { signInAction } from "./Loaders/SignIn";
import { signOutAction } from "./Loaders/SignOut";
import About from "./Pages/About";

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
                loader: HomeLoader,
                errorElement: <ErrorPage />
            },
            {
                path: "/boards",
                element: <Boards />,
                loader: boardsLoader,
                action: boardsAction,
                errorElement: <ErrorPage />
            },
            {
                path: "/sign-up/success",
                element: <SignUpSuccess />,
                errorElement: <ErrorPage />
            },
            {
                path: "/sign-out",
                element: <SignOut />,
                loader: signOutAction,
                errorElement: <ErrorPage />
            },
            {
                path: "/boards/:boardId",
                element: <BoardContainer />,
                loader: boardContainerLoader,
                errorElement: <ErrorPage />,
                action: boardContainerAction
            },
            {
                path: "/about",
                element: <About />,
                errorElement: <ErrorPage/>
            }
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