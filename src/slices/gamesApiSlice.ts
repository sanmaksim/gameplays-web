import { apiSlice } from "./apiSlice";
import type { GameSearchParams } from "../types/GameTypes";

const GAMES_URL = '/api/games';

export const gamesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGame: builder.query({
            query: (id: number) => {
                return {
                    url: `${GAMES_URL}/${id}`,
                    method: 'GET'
                };
            }
        }),
        search: builder.query({
            query: ({ queryParams, limit = "10" }: GameSearchParams) => {
                return {
                    url: `${GAMES_URL}/search`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Result-Limit': limit
                    },
                    params: queryParams
                };
            }
        })
    })
});

export const { 
    useGetGameQuery, 
    useLazySearchQuery
} = gamesApiSlice;
