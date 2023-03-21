import Logo from "../Components/Logo";
import { Link, NavLink, Outlet, useNavigation, useLocation } from "react-router-dom";
import "./css/Root.css";
import { selectIsLoggedIn } from "../Store/userReducer";
import { useSelector } from "react-redux";

export default function Root() {
    const getNavClass = ({isActive}) => (
        isActive ? "nav-link active" : "nav-link"
    );

    const navigation = useNavigation();
    const { pathname } = useLocation();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white lh-sm" to="/"><Logo/></Link>
                    <button className="navbar-toggler"
                        type="button" 
                        data-bs-toggle="collapse"
                        data-bs-target="#rootContent"
                        aria-controls="rootContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse`} id="rootContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className={({isActive}) => (isActive || pathname === "/boards" ? "nav-link active" : "nav-link")} to="/" aria-current="page" end>
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                {!isLoggedIn ? (
                                    <NavLink className={getNavClass} to="/sign-in">
                                        Sign In
                                    </NavLink>
                                ) : (
                                    <NavLink className={getNavClass} to="/sign-out">
                                        Sign Out
                                    </NavLink>
                                )}
                            </li>
                            <li className="nav-item">
                                <NavLink className={getNavClass} to="/about">
                                    About
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div>
                {
                    (navigation.state === "loading" || navigation.state === "submitting") && (
                        <div id="loading-div">
                            <div id="spinner" className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                }
                <Outlet/>
            </div>
        </div>
    );
}