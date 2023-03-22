import { redirect } from "react-router-dom";
import store from "../Store/store";
import { signIn,selectIsLoggedIn } from "../Store/userReducer";

export async function signInLoader() {
    if (selectIsLoggedIn(store.getState())) {
        return redirect("/");
    }

    return new Response("", {status: 200});
}

export async function signInAction({request}) {
    const formData = await request.formData();
    const { email, password } = Object.fromEntries(formData);
    switch (request.method) {
        case "POST": {
            const response = await fetch("/api/sign-in", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            });

            if (!response.ok) {
                throw response;
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            store.dispatch(signIn());

            return redirect("/");
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}