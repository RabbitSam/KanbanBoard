export const dummyAccounts = {
    "test@test.com": {
        password: "12345678"
    }
};

export function isLoggedIn(emailAddress) {
    if (dummyAccounts.hasOwnProperty(emailAddress)) {
        return !!dummyAccounts[emailAddress].isLoggedIn;
    }
}