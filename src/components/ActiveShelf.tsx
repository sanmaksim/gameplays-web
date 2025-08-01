import { Link } from "react-router-dom";
import { RootState } from "../store";
import { Table } from "react-bootstrap";
import { useEffect } from "react";
import { useGetPlaysByUserIdQuery } from "../slices/playsApiSlice";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import type { PlayData } from "../types/PlayTypes";

type Props = {
    status: number
}

function Shelf({ status }: Props) {
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const {
        data: playQueryData,
        isLoading,
        refetch: refetchPlayQueryData
    } = useGetPlaysByUserIdQuery(userInfo.id, { skip: !userInfo });

    const hasStatus: boolean = (
                                    Array.isArray(playQueryData) 
                                    && playQueryData.some((play: PlayData) => play.status === status)
                                )
                                ?? false;

    useEffect(() => {
        refetchPlayQueryData()
    }, [status, refetchPlayQueryData]);
    
    return (
        <>
            {playQueryData && hasStatus ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Developer</th>
                            <th>Release Date</th>
                            <th>Date Added</th>
                            <th>Hours Played</th>
                            <th>% Completed</th>
                            <th>Last Played</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playQueryData.map((play: PlayData) => {
                            if (play.status !== status) {
                                return null
                            } else {
                                return (
                                    <tr key={play.id}>
                                        <td><Link to={`/game/${play.api_game_id}`}>{play.name}</Link></td>
                                        <td>
                                            <ul className="list-unstyled">
                                                {play.developers && play.developers.map(dev =>
                                                    dev ? (
                                                        <li key={dev.id}>
                                                            {dev.name}
                                                        </li>
                                                    ) : null
                                                )}
                                            </ul>
                                        </td>
                                        <td>{play.original_release_date}</td>
                                        <td>{play.created_at}</td>
                                        <td>{play.hours_played}</td>
                                        <td>{play.percentage_completed}</td>
                                        <td>{play.last_played_at}</td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </Table>
            ) : (
                <div className="d-flex align-items-center justify-content-center w-100">
                    {isLoading ? <Loader /> : <p className="m-0">Empty shelf.</p>}
                </div>
            )}
        </>
    );

}

export default Shelf;
