import { apiSlice } from "./apiSlice";
import type { GameSearchParams } from "../types/GameTypes";

const GAMES_URL = '/api/games';

export const gamesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGame: builder.query({
            query: (id: string) => {
                return {
                    url: `${GAMES_URL}/${id}`,
                    method: 'GET'
                };
            },
            providesTags: ['Game']
        }),
        search: builder.mutation({
            query: ({ queryParams, limit = "10" }: GameSearchParams) => {
                const queryString = new URLSearchParams(queryParams).toString();
                return {
                    url: `${GAMES_URL}/search?${queryString}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Result-Limit': limit
                    }
                };
            },
            invalidatesTags: ['Game'] // to auto refetch query
        })
    })
});

export const { useGetGameQuery, useSearchMutation } = gamesApiSlice;
