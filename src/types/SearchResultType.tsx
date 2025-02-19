interface SearchResult {
    deck: string,
    description: string,
    id: number,
    image: {
        icon_url: string,
        tiny_url: string,
        small_url: string
    },
    name: string,
    original_release_date: string,
    platforms: [
        { name: string }
    ]
}

export default SearchResult;
