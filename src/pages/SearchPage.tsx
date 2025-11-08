import { Container, ListGroup } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useLazySearchQuery } from "../slices/gamesApiSlice";
import Loader from "../components/Loader";
import Paginator from "../components/Paginator";
import type { GameSearchResult, GameSearchResults } from "../types/GameTypes";

function SearchPage() {
    const [triggerSearchQuery] = useLazySearchQuery();

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const searchPage = searchParams.get('page') || '';

    const fetchGameData = async (searchString: string, pageString: string): Promise<GameSearchResults> => {
        try {
            const queryParams: { q: string, page?: string } = {
                q: searchString
            }
            if (pageString) {
                queryParams.page = pageString;
            }
            const searchQueryData: GameSearchResults = await triggerSearchQuery({ queryParams: queryParams, limit: "20" }).unwrap();
            if (!searchQueryData) {
                throw new Error('Error returning game data.');
            }
            return searchQueryData;
        } catch (error: unknown) {
            toast.error('Failed to fetch game data.');
            console.error(error);
            return {}
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
                        {data.results && data.results.map((result: GameSearchResult) => (
                            <ListGroup.Item key={result.id} className="d-flex">
                                <img
                                    alt={result.name}
                                    className="me-2"
                                    height="80"
                                    src={result.image && result.image.icon_url}
                                    width="80"
                                />
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
