export interface SearchResult {
    id?: number,
    name?: string,
    deck?: string,
    description?: string,
    developers?: [
        { name?: string }
    ],
    franchises?: [
        { name?: string }
    ],
    genres?: [
        { name?: string }
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
        { name?: string }
    ],
    publishers?: [
        { name?: string }
    ]
}

export interface SearchResults {
    error?: string,
    limit?: number,
    offset?: number,
    number_of_page_results?: number,
    number_of_total_results?: number,
    status_code?: number,
    results?: SearchResult[]
}
