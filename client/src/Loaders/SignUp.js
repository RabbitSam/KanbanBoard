import { redirect } from "react-router-dom";

export async function signUpLoader() {
    
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
                throw new Response("Could not sign up, try again.", {status: 500});
            }

            return redirect("/sign-up/success");
        }
        default: {
            throw new Response("", {status: 405});
        }
    }
}