import { Button, Container, Table } from "react-bootstrap";
import { useState } from "react";
import BacklogShelf from "../components/BacklogShelf";
import PlayedShelf from "../components/PlayedShelf";
import PlayingShelf from "../components/PlayingShelf";
import WishlistShelf from "../components/WishlistShelf";

function GamesPage() {
    const playing = 'Playing';
    const played = 'Played';
    const wishlist = 'Wishlist';
    const backlog = 'Backlog';

    const [activeShelf, setActiveShelf] = useState(playing);

    let shelf;
    switch (activeShelf) {
        case playing:
            shelf = <PlayingShelf />;
            break;
        case played:
            shelf = <PlayedShelf />;
            break;
        case wishlist:
            shelf = <WishlistShelf />;
            break;
        case backlog:
            shelf = <BacklogShelf />;
            break;
        default:
            shelf = null;
    }

    return (
        <Container className="mt-4 d-flex">
            <Table borderless style={{ width: "150px" }}>
                <thead>
                    <tr>
                        <th>Shelf: {activeShelf}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(playing)}>Playing</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(played)}>Played</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(wishlist)}>Wishlist</Button></td>
                    </tr>
                    <tr>
                        <td><Button onClick={() => setActiveShelf(backlog)}>Backlog</Button></td>
                    </tr>
                </tbody>
            </Table>
            {shelf}
        </Container>
    );
};

export default GamesPage;
