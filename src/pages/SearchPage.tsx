import { Container, ListGroup } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useSearchMutation } from "../slices/gamesApiSlice";
import Loader from "../components/Loader";
import Paginator from "../components/Paginator";
import type SearchResult from "../types/SearchResultType";
import type SearchResults from "../types/SearchResultsType";

function SearchPage() {
    const [search] = useSearchMutation();

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const searchPage = searchParams.get('page') || '';

    const fetchGameData = async (searchString: string, pageString: string): Promise<SearchResults> => {
        try {
            let queryParams: { q: string, page?: string } = {
                q: searchString
            }
            if (pageString) {
                queryParams.page = pageString;
            }
            // dispatch the query via redux
            const response = await search({ queryParams: queryParams, limit: "20" }).unwrap();
            return response;
        } catch (error: any) {
            toast.error('Failed to fetch game data.');
            console.error(error);
            return {
                error: `${error}`,
                limit: 0,
                offset: 0,
                number_of_page_results: 0,
                number_of_total_results: 0,
                status_code: 0,
                results: []
            }
        }
    };

    // track query params and fetch data when they change
    const { data, isLoading, error } = useQuery({
        queryKey: ['query', searchTerm, searchPage],
        queryFn: () => fetchGameData(searchTerm, searchPage)
    })

    return (
        <>
            <Container className="mt-4">
                {isLoading && <Loader />}
                {error && <p>Error: {error.message}</p>}
                {data && (
                    <ListGroup>
                        {data.results.map((result: SearchResult) => (
                            <ListGroup.Item key={result.id} className="d-flex">
                                <img src={result.image.icon_url} alt={result.name} className="me-2" />
                                <div>
                                    <h6><strong><Link to={`/game/${result.id}`}>{result.name}</Link></strong></h6>
                                    <p>{result.deck}</p>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Container>
            <br />
            <Container className="d-flex justify-content-center">
                {data && (
                    <Paginator searchResults={data} />
                )}
            </Container>
        </>
    )
}

export default SearchPage;
