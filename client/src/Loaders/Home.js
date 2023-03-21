import { redirect } from "react-router-dom";
import store from "../Store/store";
import { selectIsLoggedIn } from "../Store/userReducer";

export function HomeLoader() {
    if (selectIsLoggedIn(store.getState())) {
        return redirect("/boards");
    }

    return new Response("", {status: 200});
}