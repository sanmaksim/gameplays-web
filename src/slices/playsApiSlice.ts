import { apiSlice } from "./apiSlice";
import type {
    AddPlayPayload,
    DeletePlayPayload,
    GetPlayPayload
} from "../types/PlayTypes";

const PLAYS_URL = '/api/plays';

export const playsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlayByUserAndGameId: builder.query({
            query: (data: GetPlayPayload) => {
                return {
                    url: `${PLAYS_URL}/user/${data.userId}/game/${data.gameId}`,
                    method: 'GET',
                    credentials: 'include'
                }
            },
            providesTags: ['Play']
        }),
        getPlaysByUserId: builder.query({
            query: (id: number) => {
                return {
                    url: `${PLAYS_URL}/user/${id}`,
                    method: 'GET',
                    credentials: 'include'
                }
            }
        }),
        addPlay: builder.mutation({
            query: (data: AddPlayPayload) => {
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
            query: (data: DeletePlayPayload) => {
                return {
                    url: `${PLAYS_URL}/user/${data.userId}/play/${data.playId}`,
                    method: 'DELETE',
                    credentials: 'include'
                }
            },
            invalidatesTags: ['Play'] // to auto refetch query
        })
    })
});

export const {
    useGetPlayByUserAndGameIdQuery,
    useGetPlaysByUserIdQuery,
    useAddPlayMutation,
    useDeletePlayMutation
} = playsApiSlice;
