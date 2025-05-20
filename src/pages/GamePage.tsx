import { Card, Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useAddPlayMutation, useDeletePlayMutation, useGetPlaysQuery } from "../slices/playsApiSlice";
import { useGetGameQuery } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import type { PlayPayload, PlayStatus, PlayStatusItem } from "../types/PlayTypes";

function GamePage() {
  const status: PlayStatus = {
    playing: 0,
    played: 1,
    wishlist: 2,
    backlog: 3
  };

  // get the logged in user
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // get the current game
  const { gameId } = useParams();

  // gamesApiSlice endpoints
  const {
    data: gameQueryData,
    isLoading: gameQueryIsLoading,
    error: gameQueryError
  } = useGetGameQuery(gameId!);

  // playsApiSlice endpoints
  const {
    data: playQueryData, 
    //isLoading: playQueryIsLoading, 
    //error: playQueryError
  } = useGetPlaysQuery(gameId!, { skip: !userInfo });
  const [addPlay] = useAddPlayMutation();
  const [deletePlay] = useDeletePlayMutation();

  // list of headings that correspond to server related entities
  const gameEntities = [
    { heading: "Developer", content: gameQueryData?.results.developers },
    { heading: "Franchise", content: gameQueryData?.results.franchises },
    { heading: "Genre", content: gameQueryData?.results.genres },
    { heading: "Platform", content: gameQueryData?.results.platforms },
    { heading: "Publisher", content: gameQueryData?.results.publishers }
  ]

  // track and set active state of ToggleButtonGroup
  const [activeButtonGroup, setActiveButtonGroup] = useState<number[]>([]);
  const handleToggleButton = (val: number[]) => setActiveButtonGroup(val);

  // track which individual button has been clicked
  const [loadingButton, setLoadingButton] = useState<number | null>(null);

  // set date format to "Mon DD, YYYY"
  let formattedDate: string;
  if (gameQueryData && gameQueryData.results.original_release_date) {
    const dateString: string = gameQueryData.results.original_release_date;
    const date: Date = new Date(dateString);
    formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
  }

  // update active ToggleButtonGroup values upon playQueryData refetch
  useEffect(() => {
    let statuses: Array<number> = [];
    if (playQueryData) {
      playQueryData.map((item: PlayStatusItem) => {
        // copy new play status values into local array
        if (item.status !== undefined) statuses.push(item.status);
      });
    }
    // update component state with new status array
    if (statuses) setActiveButtonGroup(statuses);
  }, [playQueryData]);

  // toggle play based on active ToggleButtonGroup values
  const handleTogglePlay = async (statusValue: number, buttonGroup: number[]): Promise<void> => {
    const payload: PlayPayload = {
      userId: userInfo.id,
      gameId: gameId!,
      status: statusValue
    };

    // 'activate' the currently selected button
    setLoadingButton(statusValue);
    
    // add play if play status not in active button group, otherwise remove
    if (!buttonGroup.includes(statusValue)) {
      try {
        // add new play for user based on play status
        const response = await addPlay(payload).unwrap();
        if (!response) {
          throw new Error('Error adding play.');
        }
        toast.success(response.message);
      } catch (error) {
        toast.error("Failed to add play.");
        console.error(error);
      } finally {
        setLoadingButton(null);
      }
    } else {
      try {
        // remove existing play for user based on play status
        let playId: number | undefined;
        playQueryData?.forEach((item: PlayStatusItem) => {
          if (item.status === statusValue) {
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
      } finally {
        setLoadingButton(null);
      }
    }
  };

  return (
    <Container className="mt-4">
      {gameQueryIsLoading && <Loader />}
      {gameQueryError && (
        <p>
          Error: {
            'status' in gameQueryError
              ? `Status ${gameQueryError.status}: ${JSON.stringify(gameQueryError.data)}`
              : gameQueryError.message || 'An unknown error occurred.'
          }
        </p>
      )}
      {gameQueryData && (
        <Card className="my-2">
          <Card.Body className="d-flex">
            {gameQueryData.results.image && <img src={gameQueryData.results.image.small_url} alt={gameQueryData.results.name} />}
            <div className="d-flex flex-column mx-2">

              {/* Game info */}
              <Card.Title>{gameQueryData.results.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Release Date: {formattedDate!}</Card.Subtitle>
              <Card.Text>{gameQueryData.results.deck}</Card.Text>

              {/* Game details */}
              {gameEntities.map((gameEntity, index) => (
                <Fragment key={index}>
                  <Card.Title>
                    {gameEntity.content && gameEntity.content.length > 1 ? (<>{gameEntity.heading + "s"}</>) : (<>{gameEntity.heading}</>)}
                  </Card.Title>
                  {gameEntity.content && gameEntity.content.map((entity: any) => (
                    <li key={entity.id} style={{ listStyle: 'none' }}>
                      {entity.name}
                    </li>
                  ))}
                  <Card.Text></Card.Text>
                </Fragment>
              ))}

              {/* User list control */}
              {userInfo ? (
                <ToggleButtonGroup type="checkbox" value={activeButtonGroup} onChange={handleToggleButton}>
                  <ToggleButton id="btn-playing" value={status.playing} onClick={() => handleTogglePlay(status.playing, activeButtonGroup)}>
                    {loadingButton === status.playing ? <Loader /> : 'Playing'}
                  </ToggleButton>
                  <ToggleButton id="btn-played" value={status.played} onClick={() => handleTogglePlay(status.played, activeButtonGroup)}>
                    {loadingButton === status.played ? <Loader /> : 'Played'}
                  </ToggleButton>
                  <ToggleButton id="btn-wishlist" value={status.wishlist} onClick={() => handleTogglePlay(status.wishlist, activeButtonGroup)}>
                    {loadingButton === status.wishlist ? <Loader /> : 'Wishlist'}
                  </ToggleButton>
                  <ToggleButton id="btn-backlog" value={status.backlog} onClick={() => handleTogglePlay(status.backlog, activeButtonGroup)}>
                    {loadingButton === status.backlog ? <Loader /> : 'Backlog'}
                  </ToggleButton>
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
