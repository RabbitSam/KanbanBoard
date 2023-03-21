import store from "../Store/store";
import { signIn, signOut } from "../Store/userReducer";


export async function rootLoader() {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch("/api/isUserAuth", {
            method: "get",
            headers: {
                "x-access-token": token
            }
        });

        if (!response.ok) {
            store.dispatch(signOut());
            return response;
        }

        const data = await response.json();
        
        if (data.isLoggedIn) {
            store.dispatch(signIn());
        } else {
            store.dispatch(signOut());
        }
    } else {
        store.dispatch(signOut());
    }

    return new Response("We good.", {status: 200});
}