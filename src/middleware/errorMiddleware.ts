import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { usersApiSlice } from "../slices/usersApiSlice";
import { clearCredentials } from "../slices/authSlice";

export const rtkQueryErrorLogger: Middleware = (storeApi) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const status = (action.payload as { status?: number })?.status;
        // if the HTTP status is a 401 it means the login token has expired 
        if (status === 401) {
            // dispatch the logout mutation
            storeApi.dispatch(usersApiSlice.endpoints.logout.initiate(undefined) as any);
            // dispatch the clear credentials reducer
            storeApi.dispatch(clearCredentials());
            // redirect to the login page
            window.location.href = '/login';
        }
    }
    return next(action);
};
