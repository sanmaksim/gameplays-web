import type SearchResult from "./SearchResultType";

interface SearchResults {
    error: string,
    limit: number,
    offset: number,
    number_of_page_results: number,
    number_of_total_results: number,
    status_code: number,
    results: SearchResult[]
}

export default SearchResults;
