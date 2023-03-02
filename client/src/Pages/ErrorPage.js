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
                        Sorry, an expected error has occured.<br/>
                        <em>{error.statusText || error.message}</em>
                    </p>
                </div>
            </div>
        </div>
    );
};