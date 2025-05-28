import { apiSlice } from "./apiSlice";
import type { PlayPayload } from "../types/PlayTypes";

const PLAYS_URL = '/api/plays';

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaysByGameId: builder.query({
            query: (id: string) => {
                return {
                    url: `${PLAYS_URL}/game/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }
            },
            providesTags: ['Play']
        }),
        getPlaysByUserId: builder.query({
            query: (id: string) => {
                return {
                    url: `${PLAYS_URL}/user/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }
            }
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

export const { 
    useGetPlaysByGameIdQuery, 
    useGetPlaysByUserIdQuery, 
    useAddPlayMutation, 
    useDeletePlayMutation 
} = playsApiSlice;
