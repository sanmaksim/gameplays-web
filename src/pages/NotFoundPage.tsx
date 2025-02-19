import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage(): React.ReactElement {
    return (
        <div className="px-4 py-5 my-5 text-center">
            <h1 className="display-5 fw-bold text-body-emphasis">404 Not Found</h1>
            <div className="col-lg-6 mx-auto">
                <p className="lead mb-4">This page does not exist</p>
                <Link to="/" className="btn btn-primary btn-lg px-4 gap-3">
                    Go Back
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
