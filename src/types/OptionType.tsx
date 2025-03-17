import type { SearchResult } from "./SearchResultType";

export interface Option extends SearchResult {
    isDivider?: boolean, // used for custom react-select styling
    label?: string,
    url?: string
}
