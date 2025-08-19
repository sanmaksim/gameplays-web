import { Button, Card, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { RootState } from "../store";
import { Status } from "../types/PlayTypes";
import { toast } from "react-toastify";
import {
  useCreatePlayMutation,
  useGetPlaysQuery,
  useUpdatePlayMutation,
  useDeletePlayMutation
} from "../slices/playsApiSlice";
import { useGetGameQuery } from "../slices/gamesApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ActiveButton from "../components/ActiveButton";
import Loader from "../components/Loader";
import type { PlayRequest } from "../types/PlayTypes";

function ResultPage() {
  // get logged in user
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // get current game ID from URL
  const { gameId } = useParams();
  const apiGameId: number = Number(gameId);

  // data to get play by user and game ID
  const queryPlayRequest: PlayRequest = {
    userId: userInfo?.id,
    apiGameId: apiGameId
  }

  // for displaying game data
  const {
    data: gameQueryData,
    isLoading: gameQueryIsLoading,
    error: gameQueryError
  } = useGetGameQuery(apiGameId);

  // for displaying button data
  const {
    data: playQueryData
  } = useGetPlaysQuery(
    queryPlayRequest,
    { skip: !userInfo }
  );

  // get rtk mutation trigger functions
  const [createPlay] = useCreatePlayMutation();
  const [updatePlay] = useUpdatePlayMutation();
  const [deletePlay] = useDeletePlayMutation();

  // create a list of headings that correspond to server related entities
  const gameEntities = [
    { heading: "Developer", content: gameQueryData?.results.developers },
    { heading: "Franchise", content: gameQueryData?.results.franchises },
    { heading: "Genre", content: gameQueryData?.results.genres },
    { heading: "Platform", content: gameQueryData?.results.platforms },
    { heading: "Publisher", content: gameQueryData?.results.publishers }
  ]

  // active tracker for user shelf button
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // label tracker for user shelf button
  const [buttonLabel, setButtonLabel] = useState<string>(Status[Status.Wishlist]);

  // loading tracker for user shelf button
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

  const handleTogglePlay = async (status: Status, buttonIndex: number): Promise<void> => {
    setLoading(true);
    // add/remove play based on active/inactive button state
    if (activeIndex !== status) {
      try {
          const playRequestData: PlayRequest = {
            userId: userInfo.id,
            apiGameId: apiGameId,
            statusId: status
          };

          let response = null;

          if (activeIndex === null) {
            // create new play if the active button index was null
            response = await createPlay(playRequestData).unwrap();
          } else {
            // otherwise update the play since a non-null value for
            // an active button index means that a play already exists
            response = await updatePlay(playRequestData).unwrap();
          }

          if (!response) throw new Error('Error adding play.');

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
          const playRequestData: PlayRequest = {
            userId: userInfo.id,
            playId: playQueryData.playId
          };
          const response = await deletePlay(playRequestData).unwrap();
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
        <>
          <Card>
            <Card.Body className="bg-dark">
              <Row>

                {/* Game cover */}
                <Col xs={12} md={4} lg={3} xxl={2}>
                  <div>
                    {gameQueryData.results.image &&
                      <img
                        alt={gameQueryData.results.name}
                        className="img-fluid w-100"
                        src={gameQueryData.results.image.small_url}
                        style={{ minWidth: "200px" }}
                      />
                    }
                  </div>
                </Col>

                {/* Game title & blurb */}
                <Col xs={12} md={8} lg={9} xxl={10}>
                  <div className="d-flex flex-column h-100">
                    <Card.Title className="display-3 fw-bold text-light">{gameQueryData.results.name}</Card.Title>
                    <Card.Subtitle className="text-white-50">Release Date: {formattedDate!}</Card.Subtitle>
                    <Card.Text className="lead text-white mt-1">{gameQueryData.results.deck}</Card.Text>

                    {/* User list control */}
                    {userInfo ? (
                      <>
                        <Card.Text as={"div"} className="mt-auto">
                          <ActiveButton
                            index={activeIndex}
                            label={buttonLabel}
                            loader={loading}
                            togglePlay={handleTogglePlay}
                            showModal={handleShowModal}
                          />
                        </Card.Text>

                        {/* User shelf modal */}
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
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Game details */}
          <Card className="border-0">
            <Card.Body>
              <Row>
                <Col xs={12} md={5} lg={4} xxl={3}>
                  <Table>
                    <thead>
                      <tr>
                        <th colSpan={2}>
                          <Card.Title className="fw-bold">Game Details</Card.Title>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameEntities.map((gameEntity, index) => (
                        <tr key={index}>
                          <td>
                            <Card.Text className="fw-semibold">
                              {gameEntity.content && gameEntity.content.length > 1 ? (<>{gameEntity.heading + "s"}</>) : (<>{gameEntity.heading}</>)}
                            </Card.Text>
                          </td>
                          <td>
                            {gameEntity.content && gameEntity.content.map((entity: any) => (
                              <li key={entity.id} style={{ listStyle: 'none' }}>
                                <Card.Text>{entity.name}</Card.Text>
                              </li>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={12} md={7} lg={8} xxl={9}></Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  )
}

export default ResultPage;
