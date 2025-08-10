import { apiSlice } from "./apiSlice";

const AUTH_URL = '/api/auth';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${AUTH_URL}/login`,
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST',
                credentials: 'include'
            })
        }),
    })
});

export const { 
    useLoginMutation,
    useLogoutMutation, 
} = authApiSlice;
