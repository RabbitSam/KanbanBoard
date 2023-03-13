export async function signOutAction() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    return new Response("success", {status: 200});
}