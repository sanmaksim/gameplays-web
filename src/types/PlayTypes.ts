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
    status?: number,
    api_game_id?: number
}

export interface PlayPayload {
    userId: number,
    gameId: string,
    status: number
}

export interface PlayStatus {
    playing: number,
    played: number,
    wishlist: number,
    backlog: number
}

export interface PlayStatusItem {
    playId?: number,
    status?: number
}
