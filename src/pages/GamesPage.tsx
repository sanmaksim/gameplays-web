import { Button, Container, Table } from "react-bootstrap";
import { Status } from "../types/PlayTypes";
import { useState } from "react";
import ActiveShelf from "../components/ActiveShelf";

function GamesPage() {
    const [activeShelf, setActiveShelf] = useState(Status.Playing);

    let shelf;
    switch (activeShelf) {
        case Status.Playing:
            shelf = <ActiveShelf status={Status.Playing} />;
            break;
        case Status.Played:
            shelf = <ActiveShelf status={Status.Played}/>;
            break;
        case Status.Wishlist:
            shelf = <ActiveShelf status={Status.Wishlist} />;
            break;
        case Status.Backlog:
            shelf = <ActiveShelf status={Status.Backlog} />;
            break;
        default:
            shelf = null;
    }
    // TODO: make menu and active shelf responsive
    return (
        <Container className="mt-4 d-flex">
            <Table borderless style={{ height: "250px", width: "150px" }}>
                <thead>
                    <tr>
                        <th>Shelf: {Status[activeShelf]}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(Status.Playing)} style={{ width: "80px" }}>Playing</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(Status.Played)} style={{ width: "80px" }}>Played</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(Status.Wishlist)} style={{ width: "80px" }}>Wishlist</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(Status.Backlog)} style={{ width: "80px" }}>Backlog</Button></td>
                    </tr>
                </tbody>
            </Table>
            {shelf}
        </Container>
    );
};

export default GamesPage;
