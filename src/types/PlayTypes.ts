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
