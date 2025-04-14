import { Card, Container } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useAddPlayMutation } from "../slices/playsApiSlice";
import { useGetGameMutation } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import type { SearchResult } from "../types/DataTypes";

type Status = {
  playing: number,
  played: number,
  wishlist: number,
  backlog: number
};

type FormData = {
  userId: number,
  gameId: string,
  status: number
};

function GamePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [getGame] = useGetGameMutation();
  const [addPlay] = useAddPlayMutation();
  const { gameId } = useParams();

  const status: Status = {
    playing: 0,
    played: 1,
    wishlist: 2,
    backlog: 3
  };

  const fetchGameData = async (id: string = ''): Promise<SearchResult> => {
    try {
      // dispatch query via redux
      const response = await getGame(id).unwrap();
      if (!response) {
        throw new Error('Error returning game info.');
      }
      const searchResult: SearchResult = response.results;
      return searchResult;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to fetch game data.');
        console.error(error);
      } else {
        toast.error('Unknown error occurred.');
        console.error(error);
      }
      return {};
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameData(gameId)
  })

  const createPlay = async (playStatus: number): Promise<void> => {
    const formData: FormData = {
      userId: userInfo.userId,
      gameId: gameId!,
      status: playStatus
    };

    try {
      const response = await addPlay(formData).unwrap();
      if (!response) {
        throw new Error('Error adding play.');
      }
      toast.success(response.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to add play.");
      } else {
        toast.error("Uknown error occurred.");
      }
    }
  };

  let formattedDate: string;
  if (data && data.original_release_date) {
    const dateString: string = data.original_release_date;
    const date: Date = new Date(dateString);
    formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
  }

  // a list of game info headings that correspond 
  // to Game related entities on the server
  const gameEntities = [
    { heading: "Developer", content: data?.developers },
    { heading: "Franchise", content: data?.franchises },
    { heading: "Genre", content: data?.genres },
    { heading: "Platform", content: data?.platforms },
    { heading: "Publisher", content: data?.publishers }
  ]

  return (
    <Container className="mt-4">
      {isLoading && <Loader />}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <Card className="my-2">
          <Card.Body className="d-flex">
            {data.image && <img src={data.image.small_url} alt={data.name} />}
            <div className="d-flex flex-column mx-2">

              {/* Game info */}
              <Card.Title>{data.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Release Date: {formattedDate!}</Card.Subtitle>
              <Card.Text>{data.deck}</Card.Text>
              
              {/* Game details */}
              {gameEntities.map((gameEntity, index) => (
                <Fragment key={index}>
                  <Card.Title>
                    {gameEntity.content && gameEntity.content.length > 1 ? (<>{gameEntity.heading + "s"}</>) : (<>{gameEntity.heading}</>)}
                  </Card.Title>
                  {gameEntity.content && gameEntity.content.map(entity => (
                    <li key={entity.id} style={{ listStyle: 'none' }}>
                      {entity.name}
                    </li>
                  ))}
                  <Card.Text></Card.Text>
                </Fragment>
              ))}

              {/* User list control */}
              {userInfo ? (
                <div className="mt-auto">
                  Add to:
                  <button onClick={() => createPlay(status.playing)}>Playing</button> |
                  <button onClick={() => createPlay(status.played)}>Played</button> |
                  <button onClick={() => createPlay(status.wishlist)}>Wishlist</button> |
                  <button onClick={() => createPlay(status.backlog)}>Backlog</button>
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
