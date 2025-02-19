import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('userInfo');

const initialState = {
    userInfo: user ? JSON.parse(user) : null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
