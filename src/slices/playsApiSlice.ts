import { apiSlice } from "./apiSlice";

const PLAYS_URL = '/api/plays';

type FormData = {
    userId: number,
    gameId: string,
    status: number
};

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addPlay: builder.mutation({
            query: (data: FormData) => {
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
        }),
        getPlay: builder.mutation({
            query: (id: string) => {
                return {
                    url: `${PLAYS_URL}/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }
            }
        })
    })
});

export const { useAddPlayMutation, useGetPlayMutation } = playsApiSlice;
