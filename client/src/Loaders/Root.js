export async function rootLoader() {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch("/isUserAuth", {
            method: "get",
            headers: {
                "x-access-token": token
            }
        });

        if (!response.ok) {
            localStorage.removeItem("isLoggedIn");
            throw new Response("An Unexpected Error Occured. Try Again.")
        }

        const data = await response.json();
        
        if (data.isLoggedIn) {
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("isLoggedIn");
        }
    } else {
        localStorage.setItem("isLoggedIn", "false");
    }

    return new Response("We good.", {status: 200});
}