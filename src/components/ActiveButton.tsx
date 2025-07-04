import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Status } from "../types/PlayTypes";
import Loader from "./Loader";

type Props = {
    index: number | null,
    label: string,
    loader: boolean,
    togglePlay: (statusValue: Status, buttonIndex: number) => Promise<void>,
    showModal: () => void
}

function ActiveButton({ index, label, loader, togglePlay, showModal }: Props) {
    return (
        <Dropdown className="mx-auto" as={ButtonGroup}>
            <Button
                active={index !== null}
                data-index={Status[label as keyof typeof Status]}
                onClick={(e) => togglePlay(Status[label as keyof typeof Status], Number(e.currentTarget.dataset.index))}
                variant="primary"
            >
                {loader && index ?
                    <Loader /> :
                        index !== null && label === Status[Status.Wishlist] ?
                            `${label}ed` :
                            index !== null && label === Status[Status.Backlog] ?
                                `${label}ged` :
                                index !== null ?
                                    label :
                                    `Add to ${label}`
                }
            </Button>
            <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" onClick={showModal} />
            <Dropdown.Menu>
                <Dropdown.Item href="#"></Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ActiveButton;
