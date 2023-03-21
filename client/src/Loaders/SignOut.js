import store from "../Store/store";
import { signOut } from "../Store/userReducer";

export async function signOutAction() {
    store.dispatch(signOut());
    localStorage.removeItem("token");
    return new Response("success", {status: 200});
}