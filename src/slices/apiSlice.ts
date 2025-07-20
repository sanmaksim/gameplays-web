import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "./authSlice";

let serverUrl = "";

if (process.env.NODE_ENV === 'development') {
    serverUrl = "https://localhost:5001";
} else {
    serverUrl = "https://gameplays.test";
}

const baseQuery = fetchBaseQuery({ baseUrl: serverUrl });

/**
 * A custom base query function for RTK Query that automatically handles authentication errors.
 *
 * On every API request, this function wraps fetchBaseQuery and checks for a 401 Unauthorized error.
 * If a 401 is detected, it attempts to refresh the user's authentication (by calling the refresh endpoint).
 * - If the refresh succeeds, the original request is automatically retried once.
 * - If the refresh fails (e.g., refresh token is expired), it logs out the user,
 *   clears credentials from Redux state, and redirects to the login page.
 *
 * This centralizes authentication and token refresh logic, ensuring all endpoints
 * in the API slice benefit from robust, consistent error handling.
 */
const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Attempt to refresh token
        const refreshResult = await baseQuery(
            {
                url: '/api/v1/auth/refresh',
                method: 'POST',
                credentials: 'include'
            },
            api,
            extraOptions
        );
        if (refreshResult.data) {
            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
        } else {
            // logout the user
            await fetch('/api/users/logout',
            {
                method: 'POST',
                credentials: 'include'
            });
            // dispatch the clear credentials reducer
            api.dispatch(clearCredentials());
            // redirect to the login page
            window.location.href = '/login';
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Game', 'User', 'Play'],
    endpoints: () => ({})
});
