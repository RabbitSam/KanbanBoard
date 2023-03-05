import { Link } from "react-router-dom";

export default function SignOut() {
    return (
        <div className="px-4 py-5 my-5 text-center">
            <h1 className="display-5 fw-bold">See you soon!</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4">
                    You've signed out successfully. See you next time!
                </p>
                <div className="d-grid justify-content-center">
                    <Link to="/sign-up" className="btn btn-primary">Sign up - it's completely free!</Link>
                </div>
            </div>
        </div>
    );
}