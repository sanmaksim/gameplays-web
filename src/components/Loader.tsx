import { Spinner } from "react-bootstrap";

function Loader() {
    return (
        <Spinner
            animation="border"
            role="status"
            style={{
                width: '20px',
                height: '20px',
                margin: 'auto',
                display: 'block'
            }} />
    )
}

export default Loader;
