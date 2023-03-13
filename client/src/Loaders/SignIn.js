import { redirect } from "react-router-dom";

export async function signInAction({request}) {
    const formData = await request.formData();
    const { email, password } = Object.fromEntries(formData);
    switch (request.method) {
        case "POST": {
            const response = await fetch("/sign-in", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password
                })
            });

            if (!response.ok) {
                throw new Response("Email Address or Password is wrong", {status: 405});
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);

            return redirect("/");
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}