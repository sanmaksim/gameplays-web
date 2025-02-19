import { Link } from "react-router-dom";
import Feature from "./Feature";

function Hero() {
    return (
        <>
            {/* Hero */}
            <div className="px-4 py-5 my-5 text-center">
                <h1 className="display-5 fw-bold text-body-emphasis">What's on your play list?</h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">
                        Gameplays let's you manage your video game collection and track your backlog.
                    </p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Link to="/register">
                            <button type="button" className="btn btn-primary btn-lg px-4 gap-3">Sign up</button>
                        </Link>
                        <Link to="/login">
                            <button type="button" className="btn btn-secondary btn-lg px-4">Sign in</button>
                        </Link>
                    </div>
                </div>
            </div>

            <Feature />

        </>
    );
}

export default Hero;
