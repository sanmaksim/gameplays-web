import { apiSlice } from "./apiSlice";
import type {
    AddPlayPayload,
    DeletePlayPayload,
    GetPlayPayload,
    PlayPayload
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
        getPlays: builder.query({
            query: (playStatus: PlayPayload) => {
                return {
                    url: `${PLAYS_URL}`,
                    method: 'GET',
                    credentials: 'include',
                    params: {
                        userId: playStatus.userId,
                        statusId: playStatus.statusId
                    }
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
    useGetPlaysQuery,
    useAddPlayMutation,
    useDeletePlayMutation
} = playsApiSlice;
