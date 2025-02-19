import { Card, Container } from "react-bootstrap";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useGetGameMutation } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import type SearchResult from "../types/SearchResultType";

function GamePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [getGame] = useGetGameMutation();
  const { gameId } = useParams();

  const fetchGameData = async (id: string = ''): Promise<SearchResult> => {
    try {
      // dispatch the query via redux
      const response = await getGame(id).unwrap();
      if (!response) {
        throw new Error('Error returning game info.');
      }
      const searchResult: SearchResult = response.results;
      return searchResult;
    } catch (error: any) {
      toast.error('Failed to fetch game data.');
      console.error(error);
      return {
        deck: '',
        description: '',
        id: 0,
        image: {
          icon_url: '',
          tiny_url: '',
          small_url: ''
        },
        name: '',
        original_release_date: '',
        platforms: [
          { name: '' }
        ]
      };
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameData(gameId)
  })

  let formattedDate: string;
  if (data && data.original_release_date) {
      const dateString: string = data.original_release_date;
      const date: Date = new Date(dateString);
      formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
  }

  return (
    <Container className="mt-4">
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <Card className="my-2">
          <Card.Body className="d-flex">
            <img src={data.image.small_url} alt={data.name} />
            <div className="d-flex flex-column mx-2">
              <Card.Title>{data.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Release Date: {formattedDate!}</Card.Subtitle>
              <Card.Text>{data.deck}</Card.Text>
              <Card.Title>Platforms</Card.Title>
              {data.platforms.map((platform) => (
                <li key={platform.name} style={{ listStyle: 'none' }}>{platform.name}</li>
              ))}
              {userInfo ? (
                <div className="mt-auto">
                  Add to: Playing | Played | Wish List | Backlog
                </div>
              ) : (
                <></>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

export default GamePage;
