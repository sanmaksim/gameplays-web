import { Button, Container, Table } from "react-bootstrap";
import { Status } from "../types/PlayTypes";
import { useEffect, useState } from "react";
import ActiveShelf from "../components/ActiveShelf";

function GamesPage() {
    // toggle mobile screen size threshold
    const threshold = 768; // 768px for mobile views
    const [isBelowMobileThreshold, setIsBelowMobileThreshold] = useState(false);
    
    useEffect(() => {
        // set initial state based on current window size
        const handleResize = () => {
            if (window.innerWidth < threshold) {
                setIsBelowMobileThreshold(true);
            } else {
                setIsBelowMobileThreshold(false);
            }
        };
    
        // add resize event listener
        window.addEventListener('resize', handleResize);
        handleResize();
    
        // cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
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
            {isBelowMobileThreshold ? (
                <div className="d-flex flex-column">
                    <Table borderless style={{ maxWidth: '510px' }}>
                        <tbody>
                            <tr>
                                <td className="fw-bold">Shelf: {Status[activeShelf]}</td>
                                <td><Button onClick={() => setActiveShelf(Status.Playing)} style={{ width: "80px" }}>Playing</Button></td>
                                <td><Button onClick={() => setActiveShelf(Status.Played)} style={{ width: "80px" }}>Played</Button></td>
                                <td><Button onClick={() => setActiveShelf(Status.Wishlist)} style={{ width: "80px" }}>Wishlist</Button></td>
                                <td><Button onClick={() => setActiveShelf(Status.Backlog)} style={{ width: "80px" }}>Backlog</Button></td>
                            </tr>
                        </tbody>
                    </Table>
                    {shelf}
                </div>
            ) : (
                <>
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
                </>
            )}
        </Container>
    );
};

export default GamesPage;
