export interface GameSearchParams {
    queryParams: {
        q: string,
        page?: string
    },
    limit?: string
}

export interface GameSearchResult {
    id?: number,
    name?: string,
    date_last_updated?: string,
    deck?: string,
    description?: string,
    developers?: [
        {
            id?: number,
            name?: string
        }
    ],
    franchises?: [
        {
            id?: number,
            name?: string
        }
    ],
    genres?: [
        {
            id?: number,
            name?: string
        }
    ],
    image?: {
        icon_url?: string,
        medium_url?: string,
        screen_url?: string,
        small_url?: string,
        super_url?: string,
        thumb_url?: string,
        tiny_url?: string,
        original_url?: string,
        image_tags?: string
    },
    original_release_date?: string,
    platforms?: [
        {
            id?: number,
            name?: string
        }
    ],
    publishers?: [
        {
            id?: number,
            name?: string
        }
    ]
}

export interface GameSearchResults {
    error?: string,
    limit?: number,
    offset?: number,
    number_of_page_results?: number,
    number_of_total_results?: number,
    status_code?: number,
    results?: GameSearchResult[]
}
