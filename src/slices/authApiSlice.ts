import { apiSlice } from "./apiSlice";

const AUTH_URL = '/api/v1/auth';

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
    })
});

export const { useLoginMutation } = authApiSlice;
