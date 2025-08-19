import { apiSlice } from "./apiSlice";
import type { PlayRequest } from "../types/PlayTypes";

const PLAYS_URL = '/api/plays';

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPlay: builder.mutation({
            query: (data: PlayRequest) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        userId: data.userId,
                        apiGameId: data.apiGameId,
                        statusId: data.statusId
                    }
                };
            },
            invalidatesTags: ['Play'] // to auto refetch query
        }),
        getPlays: builder.query({
            query: (data: PlayRequest) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'GET',
                    credentials: 'include',
                    params: {
                        userId: data.userId,
                        apiGameId: data.apiGameId,
                        statusId: data.statusId
                    }
                }
            },
            providesTags: ['Play']
        }),
        updatePlay: builder.mutation({
            query: (data: PlayRequest) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        userId: data.userId,
                        apiGameId: data.apiGameId,
                        statusId: data.statusId
                    }
                };
            },
            invalidatesTags: ['Play'] // to auto refetch query
        }),
        deletePlay: builder.mutation({
            query: (data: PlayRequest) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'DELETE',
                    credentials: 'include',
                    params: {
                        userId: data.userId,
                        playId: data.playId
                    }
                }
            },
            invalidatesTags: ['Play'] // to auto refetch query
        })
    })
});

export const {
    useCreatePlayMutation,
    useGetPlaysQuery,
    useUpdatePlayMutation,
    useDeletePlayMutation
} = playsApiSlice;
