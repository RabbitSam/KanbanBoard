import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        signIn: state => {
            state.isLoggedIn = true;
        },
        signOut: state => {
            state.isLoggedIn = false;
        }
    }
});

export const selectIsLoggedIn = state => state.user.isLoggedIn;

export const { signIn, signOut } = userSlice.actions;

export default userSlice.reducer;