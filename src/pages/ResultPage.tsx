import { Button, Card, Container, Modal } from "react-bootstrap";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store";
import { Status } from "../types/PlayTypes";
import { toast } from "react-toastify";
import { useAddPlayMutation, useDeletePlayMutation, useGetPlaysByGameIdQuery } from "../slices/playsApiSlice";
import { useGetGameQuery } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ActiveButton from "../components/ActiveButton";
import Loader from "../components/Loader";
import type { PlayPayload } from "../types/PlayTypes";

function ResultPage() {
  // get logged in user
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // get current game ID from URL
  const { gameId } = useParams();

  // destructure game query result
  const {
    data: gameQueryData,
    isLoading: gameQueryIsLoading,
    error: gameQueryError
  } = useGetGameQuery(gameId!);

  // destructure play query result
  const {
    data: playQueryData, 
    //isLoading: playQueryIsLoading, 
    //error: playQueryError
  } = useGetPlaysByGameIdQuery(gameId!, { skip: !userInfo });

  // get rtk mutation trigger functions
  const [addPlay] = useAddPlayMutation();
  const [deletePlay] = useDeletePlayMutation();

  // create a list of headings that correspond to server related entities
  const gameEntities = [
    { heading: "Developer", content: gameQueryData?.results.developers },
    { heading: "Franchise", content: gameQueryData?.results.franchises },
    { heading: "Genre", content: gameQueryData?.results.genres },
    { heading: "Platform", content: gameQueryData?.results.platforms },
    { heading: "Publisher", content: gameQueryData?.results.publishers }
  ]

  // active tracker for buttons
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [buttonLabel, setButtonLabel] = useState<string>(Status[Status.Wishlist]);

  const [loading, setLoading] = useState<boolean>(false);

  // modal dialog control
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // set date format to "Mon DD, YYYY"
  let formattedDate: string;
  if (gameQueryData && gameQueryData.results.original_release_date) {
    const dateString: string = gameQueryData.results.original_release_date;
    const date: Date = new Date(dateString);
    formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
  }

  // update active button
  useEffect(() => {
    if (playQueryData && playQueryData.status !== undefined) {
      setActiveIndex(playQueryData.status);
      setButtonLabel(Status[playQueryData.status]);
    }
  }, [playQueryData]);

  const handleTogglePlay = async (statusValue: Status, buttonIndex: number): Promise<void> => {
    const payload: PlayPayload = {
      userId: userInfo.id,
      gameId: gameId!,
      status: statusValue
    };
    setLoading(true);
    // add/remove play based on active/inactive button state
    if (activeIndex !== statusValue) {
      try {
        const response = await addPlay(payload).unwrap();
        if (!response) {
          throw new Error('Error adding play.');
        }
        toast.success(response.message);
        // set the main button to the selected label
        setActiveIndex(buttonIndex);
        setButtonLabel(Status[buttonIndex]);
      } catch (error) {
        toast.error("Failed to add play.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (activeIndex === playQueryData.status) {
          const response = await deletePlay(playQueryData.playId).unwrap();
          if (!response) {
            throw new Error('Error removing from shelf.');
          }
          toast.success(response.message);
          // reset the main button back to the unselected/default 'wishlist' label
          setActiveIndex(null);
          setButtonLabel(Status[Status.Wishlist]);
        } else {
          throw new Error('Invalid play status.');
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to remove game.");
          console.error(error);
        }
      } finally {
        setLoading(false);
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
            {gameQueryData.results.image && 
              <img
                alt={gameQueryData.results.name}
                src={gameQueryData.results.image.small_url}
              />
            }
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
                <>
                  <Card.Text as={"div"}>
                    <ActiveButton
                      index={activeIndex}
                      label={buttonLabel}
                      loader={loading}
                      togglePlay={handleTogglePlay}
                      showModal={handleShowModal}
                    />
                  </Card.Text>

                  <Modal centered show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Choose a shelf for this game</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex flex-column align-items-center justify-content-center mb-2">
                      <Button
                        active={activeIndex === Status.Playing}
                        className="w-50 mb-3"
                        data-index={Status.Playing}
                        onClick={(e) => handleTogglePlay(Status.Playing, Number(e.currentTarget.dataset.index))}
                        variant="outline-primary"
                      >
                        {loading && activeIndex === Status.Playing ?
                          <Loader /> :
                            activeIndex === Status.Playing ?
                              Status[Status.Playing] :
                                `Add to ${Status[Status.Playing]}`
                        }
                      </Button>
                      <Button
                        active={activeIndex === Status.Played}
                        className="w-50 mb-3"
                        data-index={Status.Played}
                        onClick={(e) => handleTogglePlay(Status.Played, Number(e.currentTarget.dataset.index))}
                        variant="outline-primary"
                      >
                        {loading && activeIndex === Status.Played ?
                          <Loader /> :
                            activeIndex === Status.Played ?
                              Status[Status.Played] :
                                `Add to ${Status[Status.Played]}`
                        }
                      </Button>
                      <Button
                        active={activeIndex === Status.Wishlist}
                        className="w-50 mb-3"
                        data-index={Status.Wishlist}
                        onClick={(e) => handleTogglePlay(Status.Wishlist, Number(e.currentTarget.dataset.index))}
                        variant="outline-primary"
                      >
                        {loading && activeIndex === Status.Wishlist ?
                          <Loader /> :
                            activeIndex === Status.Wishlist ?
                              `${Status[Status.Wishlist]}ed` :
                                `Add to ${Status[Status.Wishlist]}`
                        }
                      </Button>
                      <Button
                        active={activeIndex === Status.Backlog}
                        className="w-50"
                        data-index={Status.Backlog}
                        onClick={(e) => handleTogglePlay(Status.Backlog, Number(e.currentTarget.dataset.index))}
                        variant="outline-primary"
                      >
                        {loading && activeIndex === Status.Backlog ?
                          <Loader /> :
                            activeIndex === Status.Backlog ?
                              `${Status[Status.Backlog]}ged` :
                                `Add to ${Status[Status.Backlog]}`
                        }
                      </Button>
                    </Modal.Body>
                  </Modal>
                </>
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

export default ResultPage;
