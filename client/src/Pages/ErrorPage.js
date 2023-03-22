import { useRouteError } from "react-router-dom";


export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="p-3">
            <div className="card text-center">
                <div className="card-body">
                    <h1 className="card-title">Oops!</h1>
                    <p className="card-text">
                        Sorry, an unexpected error has occured. Please try again.<br/>
                        <em>{error.statusText || error.data.message}</em>
                    </p>
                </div>
            </div>
        </div>
    );
};