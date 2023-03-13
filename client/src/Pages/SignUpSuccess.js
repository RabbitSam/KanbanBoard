import { Link } from "react-router-dom";

export default function SignUpSuccess() {
    return (
        <div className="px-4 py-5 my-5 text-center">
            <h1 className="display-5 fw-bold">Signed Up Successfully!</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4">
                    You're one of us now! Time to get cracking!
                </p>
                <div className="d-grid justify-content-center">
                    <Link to="/sign-in" className="btn btn-primary">Sign in - get started now!</Link>
                </div>
            </div>
        </div>
    );
}