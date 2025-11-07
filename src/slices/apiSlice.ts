import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials, setCredentials } from "./authSlice";

const apiAuth = '/api/auth';
const serverUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({ baseUrl: serverUrl });

/**
 * A custom base query function for RTK Query that automatically handles authentication errors.
 *
 * On every API request, this function wraps fetchBaseQuery and checks for a 401 Unauthorized error.
 * If a 401 is detected, it attempts to refresh the user's authentication (by calling the refresh endpoint).
 * - If the refresh succeeds, the original request is automatically retried once.
 * - If the refresh fails with an error message (e.g. invalid credentials) then simply continue with the request.
 * - Otherwise, if the refresh fails without an error message (e.g., refresh token is expired), 
 *   it logs out the user, clears credentials from Redux state, and redirects to the login page.
 *
 * This centralizes authentication and token refresh logic, ensuring all endpoints
 * in the API slice benefit from robust, consistent error handling.
 */
const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: Record<string, unknown>) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Attempt to refresh both access & refresh tokens
        const refreshResult = await baseQuery(
            {
                url: `${apiAuth}/refresh`,
                method: 'POST',
                credentials: 'include'
            },
            api,
            extraOptions
        );
        if (refreshResult.data) {
            // Store the refreshed user data before retrying
            api.dispatch(setCredentials(refreshResult.data));
            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
        } else if (result.error.data
            && typeof result.error.data === 'object'
            && 'message' in result.error.data) {
                // Simply return the original result 
                // in the case of invalid credentials
                return result;
        } else {
            // Otherwise logout the user
            await fetch(`${apiAuth}/logout`,
            {
                method: 'POST',
                credentials: 'include'
            });
            // Clear user credentials
            api.dispatch(clearCredentials());
            // Redirect user back to login
            window.location.href = '/login';
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Play'],
    endpoints: () => ({})
});
