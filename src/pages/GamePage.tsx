import { Card, Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useAddPlayMutation, useGetPlayMutation } from "../slices/playsApiSlice";
import { useGetGameMutation } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
  const [getPlay] = useGetPlayMutation();
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

  const gameQuery = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameData(gameId)
  })

  const fetchPlayData = async (id: string = ''): Promise<Array<number>> => {
    try {
      const response = await getPlay(id).unwrap();
      if (!response) {
        throw new Error('Error returning play info.');
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Failed to fetch play data.');
        console.error(error);
      } else {
        toast.error('Unknown error occurred.');
        console.error(error);
      }
      return [];
    }
  };

  const playQuery = useQuery({
    queryKey: ['play', gameId],
    queryFn: () => fetchPlayData(gameId),
    enabled: !!userInfo
  });

  useEffect(() => {
    if (playQuery.data) setValue(playQuery.data);
  }, [playQuery.data]);

  // play button toggle control
  const [value, setValue] = useState<number[]>([]);

  const toggleButton = (val: number[]) => setValue(val);

  const createPlay = async (playStatus: number): Promise<void> => {
    const formData: FormData = {
      userId: userInfo.id,
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
  if (gameQuery.data && gameQuery.data.original_release_date) {
    const dateString: string = gameQuery.data.original_release_date;
    const date: Date = new Date(dateString);
    formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
  }

  // a list of game info headings that correspond 
  // to Game related entities on the server
  const gameEntities = [
    { heading: "Developer", content: gameQuery.data?.developers },
    { heading: "Franchise", content: gameQuery.data?.franchises },
    { heading: "Genre", content: gameQuery.data?.genres },
    { heading: "Platform", content: gameQuery.data?.platforms },
    { heading: "Publisher", content: gameQuery.data?.publishers }
  ]

  return (
    <Container className="mt-4">
      {gameQuery.isLoading && <Loader />}
      {gameQuery.error && <p>Error: {gameQuery.error.message}</p>}
      {gameQuery.data && (
        <Card className="my-2">
          <Card.Body className="d-flex">
            {gameQuery.data.image && <img src={gameQuery.data.image.small_url} alt={gameQuery.data.name} />}
            <div className="d-flex flex-column mx-2">

              {/* Game info */}
              <Card.Title>{gameQuery.data.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Release Date: {formattedDate!}</Card.Subtitle>
              <Card.Text>{gameQuery.data.deck}</Card.Text>

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
                <ToggleButtonGroup type="checkbox" value={value} onChange={toggleButton}>
                  <ToggleButton id="btn-playing" value={status.playing} onClick={() => createPlay(status.playing)}>Playing</ToggleButton>
                  <ToggleButton id="btn-played" value={status.played} onClick={() => createPlay(status.played)}>Played</ToggleButton>
                  <ToggleButton id="btn-wishlist" value={status.wishlist} onClick={() => createPlay(status.wishlist)}>Wishlist</ToggleButton>
                  <ToggleButton id="btn-backlog" value={status.backlog} onClick={() => createPlay(status.backlog)}>Backlog</ToggleButton>
                </ToggleButtonGroup>
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
