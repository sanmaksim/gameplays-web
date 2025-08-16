export enum Status {
    Playing,
    Played,
    Wishlist,
    Backlog
}

export interface PlayData {
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

export interface AddPlayPayload {
    userId?: string,
    gameId?: string,
    status?: Status
}

export interface DeletePlayPayload {
    userId?: string,
    playId?: string
}

export interface GetPlayPayload {
    userId?: string,
    gameId?: string
}

export interface PlayStatusItem {
    playId?: number,
    status?: Status
}

export interface PlayPayload {
    userId?: number,
    gameId?: number,
    playId?: number,
    statusId?: Status
}