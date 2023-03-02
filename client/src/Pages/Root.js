import "./css/Root.css"
import Logo from "../Components/Logo";
import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="/"><Logo/></a>
                </div>
            </nav>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}