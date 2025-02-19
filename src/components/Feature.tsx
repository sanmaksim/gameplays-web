import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons/faMobileScreenButton';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons/faShareNodes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steam } from 'react-bootstrap-icons';

function Feature() {
    return (
        <div className="container px-4 py-5">
            <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-dark fs-2 mb-3">
                        <Steam />
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Import from Steam</h3>
                    <p>Prefer an effortless setup? Seamlessly sync with Steam and focus on what you love most: gaming!</p>
                </div>
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-dark fs-2 mb-3">
                        <FontAwesomeIcon icon={faShareNodes} />
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Share with friends</h3>
                    <p>Want to show off your game collection and progress? Easily share with friends and showcase your gaming achievements!</p>
                </div>
                <div className="feature col">
                    <div className="feature-icon d-inline-flex align-items-center justify-content-center text-dark fs-2 mb-3">
                    <FontAwesomeIcon icon={faMobileScreenButton} />
                    </div>
                    <h3 className="fs-2 text-body-emphasis">Download the app</h3>
                    <p>Coming soon!</p>
                </div>
            </div>
        </div>
    )
}

export default Feature;
