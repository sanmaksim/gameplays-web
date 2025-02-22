import { apiSlice } from "./apiSlice";

const PLAYS_URL = '/api/plays';

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addPlay: builder.mutation({
            query: (data) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                };
            }
        })
    })
});

export const { useAddPlayMutation } = playsApiSlice;
