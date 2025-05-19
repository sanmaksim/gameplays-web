import { apiSlice } from "./apiSlice";
import type { PlayPayload } from "../types/PlayTypes";

const PLAYS_URL = '/api/plays';

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlay: builder.query({
            query: (id: string) => {
                return {
                    url: `${PLAYS_URL}/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }
            },
            providesTags: ['Play']
        }),
        addPlay: builder.mutation({
            query: (data: PlayPayload) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data
                };
            },
            invalidatesTags: ['Play'] // to auto refetch query
        }),
        deletePlay: builder.mutation({
            query: (playId: number) => {
                return {
                    url: `${PLAYS_URL}/${playId}`,
                    method: 'DELETE',
                    credentials: 'include'
                }
            },
            invalidatesTags: ['Play'] // to auto refetch query
        })
    })
});

export const { useGetPlayQuery, useAddPlayMutation, useDeletePlayMutation } = playsApiSlice;
