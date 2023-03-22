import { redirect } from "react-router-dom";
import store from "../Store/store";
import { selectIsLoggedIn } from "../Store/userReducer";

export async function signUpLoader() {
    if (selectIsLoggedIn(store.getState())) {
        return redirect("/");
    }

    return new Response("", {status: 200});
}

export async function signUpAction({request}) {
    const formData = await request.formData();
    const { name, email, password } = Object.fromEntries(formData);
    switch (request.method) {
        case "PUT": {
            const url = "/api/sign-up"
            const response = await fetch(url, {
                method: "put",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            if (!response.ok) {
                throw response;
            }

            return redirect("/sign-up/success");
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}