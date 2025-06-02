import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Status } from "../types/PlayTypes";

type Props = {
    index: number | null,
    label: string,
    addPlay: (statusValue: Status, buttonIndex: number) => Promise<void>,
    showModal: () => void
}

function ActiveButton({ index, label, addPlay, showModal }: Props) {
    return (
        <Dropdown className="mx-auto" as={ButtonGroup}>
            <Button
                active={index !== null}
                data-index={index}
                onClick={(e) => addPlay(index!, Number(e.currentTarget.dataset.index))}
                variant="primary"
            >
                {label === 'Wishlist' ?
                    `${label}ed` :
                    label === 'Backlog' ?
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
