import { Card, Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useAddPlayMutation, useDeletePlayMutation, useGetPlayMutation } from "../slices/playsApiSlice";
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
}

type FormData = {
  userId: number,
  gameId: string,
  status: number
}

type StatusItem = {
  playId?: number,
  status?: number
}

function GamePage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { gameId } = useParams();

  const [getGame] = useGetGameMutation();
  const [addPlay] = useAddPlayMutation();
  const [deletePlay] = useDeletePlayMutation();
  const [getPlay] = useGetPlayMutation();
  
  // play button toggle control
  const [value, setValue] = useState<number[]>([]);

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
    } catch (error) {
      toast.error('Failed to fetch game data.');
      console.error(error);
      return {};
    }
  };

  const gameQuery = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGameData(gameId)
  })

  const fetchPlayData = async (id: string = ''): Promise<Array<any>> => {
    try {
      const response = await getPlay(id).unwrap();
      if (!response) {
        throw new Error('Error returning play info.');
      }
      return response;
    } catch (error) {
      toast.error('Failed to fetch play data.');
      console.error(error);
      return [];
    }
  };

  const playQuery = useQuery({
    queryKey: ['play', gameId],
    queryFn: () => fetchPlayData(gameId),
    enabled: !!userInfo // only run when user is logged in
  });

  useEffect(() => {
    // copy returned play status values into local array
    let statuses: Array<number> = [];
    if (playQuery.data) {
      playQuery.data.map((item: StatusItem) => {
        //console.log("item.status: ", item.status);
        if (item.status !== undefined) statuses.push(item.status);
      });
    }
    // update component state with status array
    //console.log("statuses", statuses);
    if (statuses) setValue(statuses);
  }, [playQuery.data]);

  const toggleButton = (val: number[]) => setValue(val);

  const togglePlay = async (playStatus: number, btnGrpArray: number[]): Promise<void> => {
    const formData: FormData = {
      userId: userInfo.id,
      gameId: gameId!,
      status: playStatus
    };

    // check whether the user has toggled a play
    const toggle = (pStatus: number, btnGrpArr: number[]): boolean => {
      // if the play status is already in the array, return false (toggle off)
      if (btnGrpArr.includes(pStatus)) {
        return false;
      }
      // otherwise return true (toggle on)
      return true;
    };

    if (toggle(playStatus, btnGrpArray)) {
      try {
        const response = await addPlay(formData).unwrap();
        if (!response) {
          throw new Error('Error adding play.');
        }
        toast.success(response.message);
      } catch (error) {
        toast.error("Failed to add play.");
        console.error(error);
      }
    } else {
      try {
        // check which play to remove based on the status
        let playId: number | undefined;
        playQuery.data?.forEach((item: StatusItem) => {
          if (item.status === playStatus) {
            playId = item.playId;
          }
        });
        if (playId !== undefined) {
          const response = await deletePlay(playId).unwrap();
          if (!response) {
            throw new Error('Error deleting play.');
          }
          toast.success(response.message);
        } else {
          throw new Error('Error getting playId');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to delete play.");
          console.error(error);
        }
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
                  <ToggleButton id="btn-playing" value={status.playing} onClick={() => togglePlay(status.playing, value)}>Playing</ToggleButton>
                  <ToggleButton id="btn-played" value={status.played} onClick={() => togglePlay(status.played, value)}>Played</ToggleButton>
                  <ToggleButton id="btn-wishlist" value={status.wishlist} onClick={() => togglePlay(status.wishlist, value)}>Wishlist</ToggleButton>
                  <ToggleButton id="btn-backlog" value={status.backlog} onClick={() => togglePlay(status.backlog, value)}>Backlog</ToggleButton>
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
