import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import PageProvider from "../providers/PageProvider";

function MainLayout() {
    return (
        <PageProvider>
            <ToastContainer />
            <Container fluid="true">
                <NavBar />
                <Outlet />
                <Footer />
            </Container>
        </PageProvider>
    );
}

export default MainLayout;
