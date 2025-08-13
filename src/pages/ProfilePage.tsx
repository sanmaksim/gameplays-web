import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { clearCredentials, setCredentials } from '../slices/authSlice';
import { Container } from 'react-bootstrap';
import { RootState } from '../store';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDeleteUserMutation, useUpdateUserMutation } from '../slices/usersApiSlice';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/esm/Form';
import Modal from 'react-bootstrap/Modal';
import Loader from '../components/Loader';
import type { UserPayload } from '../types/UserTypes';

function ProfilePage() {
    const [un, setUn] = useState('');
    const [mail, setMail] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [unTouched, setUnTouched] = useState(false);
    const [mailTouched, setMailTouched] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        setUn(userInfo.username);
        setMail(userInfo.email);
    }, [userInfo.setUn, userInfo.setMail]);

    const handleUnInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setUn(evt.target.value);
        setUnTouched(true);
    };

    const handleMailInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setMail(evt.target.value);
        setMailTouched(true);
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const payload: UserPayload = {
        userId: userInfo.id,
        username: un,
        email: mail,
        password: pwd
    };

    const submitForm = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if (pwd !== confirmPwd) {
            toast.error('Passwords do not match.');
        } else {
            try {
                // Do not unwrap the mutation since we need to
                // test for which properties are present
                const response = await updateUser(payload);
                if (
                    response.data 
                    && response.data.id
                    && response.data.username
                    && response.data.email
                ) {
                    // Set user credentials if the response
                    // contains the expected user data
                    dispatch(setCredentials(response.data));
                    toast.success("Changes saved.");
                } else if (
                    response.data
                    && response.data.message
                ) {
                    // Display the message if that is all
                    // that is returned by the response
                    toast.success(response.data.message);
                } else if (response.error) {
                    // We need to extract a suitable message string
                    // from the response before passing it to the toast
                    const message = (response.error as any)?.data?.message
                                    || (response.error as Error)?.message
                                    || "An error occurred";
                    toast.error(message);
                }
                // Always clear the password fields
                setPwd('');
                setConfirmPwd('');
            } catch (error) {
                toast.error("An error occurred.");
            }
        }
    };

    const deleteUserHandler = async () => {
        try {
            const response = await deleteUser(userInfo.id).unwrap();
            dispatch(clearCredentials());
            navigate('/');
            toast.success(response.message);
        } catch (error: any) {
            toast.error(error.data.message || "An error occurred.");
        }
    };

    return (
        <Container className="mx-auto mt-5">
            <Card className="mx-auto" style={{ width: '20rem' }}>
                <Card.Body>

                    <Card.Title className="lg mb-3">Edit your profile</Card.Title>

                    <Form onSubmit={submitForm}>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                value={un}
                                onChange={handleUnInputChange}
                                required
                                isInvalid={!un && unTouched} />
                            <Form.Control.Feedback type="invalid">Please enter a valid username.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={mail}
                                onChange={handleMailInputChange}
                                required
                                isInvalid={!mail && mailTouched} />
                            <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={pwd}
                                onChange={(evt) => setPwd(evt.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPwd}
                                onChange={(evt) => setConfirmPwd(evt.target.value)} />
                        </Form.Group>

                        {/* { isLoading && <Loader /> } */}

                        <Container className="m-0 p-0 row-cols-2">
                            <div className="d-inline-flex justify-content-start">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isLoading}
                                    style={{ height: '38px', width: '75px' }}>
                                    {isLoading ? <Loader /> : 'Save'}
                                </Button>
                            </div>

                            <div className="d-inline-flex justify-content-end">
                                <Button
                                    variant="outline-danger"
                                    type="button"
                                    style={{ height: '38px', width: '75px' }}
                                    onClick={handleShowModal}>
                                    Delete
                                </Button>
                            </div>
                        </Container>

                    </Form>

                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your user account?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="outline-danger" onClick={deleteUserHandler}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProfilePage;
