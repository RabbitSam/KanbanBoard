import Logo from "../Components/Logo";
import { Link, NavLink, Outlet, useNavigation } from "react-router-dom";
import "./css/Root.css";

export default function Root() {
    const getNavClass = ({isActive, isPending}) => (
        isActive ? "nav-link active" : isPending ? "nav-link" : "nav-link"
    );

    const navigation = useNavigation();

    const getNavState = () => {
        console.log(navigation.state);
        return navigation.state;  
    };

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
                                <NavLink className={getNavClass} to="/" aria-current="page">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={getNavClass} to="/sign-in">
                                    Sign In
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={getNavClass} to="/about">
                                    About
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={getNavClass} to="/boards">
                                    Boards [test]
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div>
                {
                    getNavState() === "loading" ? (
                        <div id="loading-div">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                    : (
                        <Outlet/>
                    )
                }
            </div>
        </div>
    );
}