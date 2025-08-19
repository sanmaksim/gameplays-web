export enum Status {
    Playing,
    Played,
    Wishlist,
    Backlog
}

export interface PlayResponse {
    id?: number,
    name?: string,
    developers?: [
        {
            id?: number,
            name?: string
        }
    ],
    original_release_date?: string,
    created_at?: string,
    hours_played?: number,
    percentage_completed?: number,
    last_played_at?: string,
    status?: Status,
    api_game_id?: number
}

export interface PlayRequest {
    userId?: number,
    apiGameId?: number,
    playId?: number,
    statusId?: Status
}
