import { useState } from "react";
import Logo from "../Components/Logo";
import Toast from "../Components/Toast";
import "./css/SignUpSignIn.css";
import { Link, useSubmit } from "react-router-dom";


function ErrorToast(props) {
    return (
        <Toast isShowing={props.isToastShowing} type={"error"}>
            <div className="container">
                <div className="row">
                    <div className="col-10">
                        <h2 className="h4">Error!</h2>
                    </div>
                    <div className="col-2">
                        <button className="btn text-white" onClick={() => props.setIsToastShowing(!props.isToastShowing)}>
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <p>The following errors occured:</p>
                        <ul>
                            {props.errorMessages.map((message, index) => (
                                <li key={index}>{message}</li>   
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Toast>
    );
}

export function SignIn() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isToastShowing, setIsToastShowing] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isQuerying, setIsQuerying] = useState(false);

    const submit = useSubmit();

    const onSubmit = e => {
        e.preventDefault();
        const newErrorMessages = [];
        if (!user.email.length || !user.password.length) {
            newErrorMessages.push("One (or more) of the fields is empty.")
        }

        if (newErrorMessages.length) {
            setErrorMessages(newErrorMessages);
            setIsToastShowing(true);
        } else {
            setIsQuerying(true);
            submit(user, {method: "POST"});
        }
    };

    const onShowPasswordClicked = e => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const onFormChange = (e, field) => {
        setUser({
            ...user,
            [field]: e.target.value
        });
    };

    return (
        <>
            <ErrorToast 
                isToastShowing={isToastShowing}
                setIsToastShowing={setIsToastShowing}
                errorMessages={errorMessages}
            />
            <div className="d-flex bg-light" style={{alignItems: "center", height: "100vh"}}>
                <div className="sign-form text-center w-100 m-auto">
                    <form onSubmit={onSubmit} className="needs-validation" noValidate>
                        <Logo/>
                        <h1 className="h3 mb-3 fw-normal">Sign In</h1>
                        <div className="form-floating">
                            <input type="email" id="email-address" className="form-control first-input" placeholder="name@example.com" name="email" value={user.email} onChange={e => onFormChange(e, "email")} required/>
                            <label htmlFor="email-address">Email Address</label>
                        </div>
                        <div className="input-group">
                            <div className="form-floating">
                                <input type={showPassword ? "text" : "password"} id="input-password" className="form-control last-input" name="password" placeholder="..." value={user.password} onChange={e => onFormChange(e, "password")} required/>
                                <label htmlFor="input-password">Password</label>
                            </div>
                            <span id="sign-in-show-password" className="input-group-text" onClick={onShowPasswordClicked}>
                                <i className="bi bi-eye"></i>
                            </span>
                        </div>
                        <button type="submit" className={`w-100 btn btn-primary my-3 ${isQuerying ? "disabled" : ""}`} >
                            {isQuerying ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="visually-hidden">Signing In...</span>
                                </div>
                            )
                            : "Sign in"}
                        </button>
                        <div className="fs-6">
                            Don't have an account? <Link to="/sign-up" className="link-primary">Sign up now!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export function SignUp() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isToastShowing, setIsToastShowing] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isQuerying, setIsQuerying] = useState(false);

    const submit = useSubmit();

    const onSubmit = e => {
        e.preventDefault();
        const newErrorMessages = [];
        if (!user.email.length || !user.password.length || !user.confirmPassword.length) {
            newErrorMessages.push("One (or more) of the fields is empty.");
        }

        if (user.password !== user.confirmPassword) {
            newErrorMessages.push("Passwords must be the same.");
        }

        if (newErrorMessages.length) {
            setErrorMessages(newErrorMessages);
            setIsToastShowing(true);
        } else {
            setIsQuerying(true);
            submit(user, {method: "PUT"})
        }
    };

    const onShowPasswordClicked = (e) => {
        setShowPassword(e.currentTarget.checked);
    };

    const onFormChange = (e, field) => {
        setUser({
            ...user,
            [field]: e.target.value
        });
    };

    return (
        <>
            <ErrorToast 
                isToastShowing={isToastShowing}
                setIsToastShowing={setIsToastShowing}
                errorMessages={errorMessages}
            />
            <div className="d-flex bg-light" style={{alignItems: "center", height: "100vh"}}>
                <div className="sign-form text-center w-100 m-auto">
                    <form onSubmit={onSubmit} className="needs-validation" noValidate>
                        <Logo/>
                        <h1 className="h3 mb-3 fw-normal">Sign Up</h1>
                        <div className="form-floating">
                            <input type="text" id="user-name" className="form-control first-input" placeholder="Example Name" name="name" value={user.name} onChange={e => onFormChange(e, "name")} required/>
                            <label htmlFor="user-name">Name</label>
                        </div>
                        <div className="form-floating">
                            <input type="email" id="email-address" className="form-control rounded-0" placeholder="name@example.com" name="email" value={user.email} onChange={e => onFormChange(e, "email")} required/>
                            <label htmlFor="email-address">Email Address</label>
                        </div>
                        <div className="form-floating">
                            <input type={showPassword ? "text" : "password"} id="input-password" className="form-control rounded-0" placeholder="..." name="password" value={user.password} onChange={e => onFormChange(e, "password")} required/>
                            <label htmlFor="input-password">Password</label>
                        </div>
                        <div className="form-floating">
                            <input type={showPassword ? "text" : "password"} id="confirm-password" className="form-control last-input" placeholder="..." name="confirmPassword" value={user.confirmPassword} onChange={e => onFormChange(e, "confirmPassword")} required/>
                            <label htmlFor="confirm-password">Confirm Password</label>
                        </div>
                        <div className="form-check my-3 text-start">
                            <input className="form-check-input" type="checkbox" value="" id="show-password" checked={showPassword} onChange={onShowPasswordClicked}/>
                            <label htmlFor="show-password" className="form-check-label">Show Password</label>
                        </div>
                        <button type="submit" className={`w-100 btn btn-primary ${isQuerying ? "disabled" : ""}`} >
                            {isQuerying ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="visually-hidden">Signing Up...</span>
                                </div>
                            )
                            : "Sign up"}
                        </button>
                        <div className="fs-6 mt-3">
                            Already have an account? <Link to="/sign-in" className="link-primary">Sign in here!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}