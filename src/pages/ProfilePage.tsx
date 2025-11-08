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
import type { UserRequest } from '../types/UserTypes';

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
    }, [
        userInfo.username, 
        userInfo.email, 
        userInfo.setUn, 
        userInfo.setMail
    ]);

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

    const userRequestData: UserRequest = {
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
                const response = await updateUser(userRequestData).unwrap();
                dispatch(setCredentials(response));
                toast.success("Changes saved.");
                // Always clear the password fields
                setPwd('');
                setConfirmPwd('');
            } catch (error: unknown) {
                // Safely extract response-like `.data` without using `any`
                const getDataFromError = (e: unknown): unknown => {
                    if (typeof e !== 'object' || e === null) return null;
                    const obj = e as Record<string, unknown>;
                    if (obj.response && typeof obj.response === 'object' && obj.response !== null) {
                        const resp = obj.response as Record<string, unknown>;
                        return resp.data ?? null;
                    }
                    return obj.data ?? null;
                };

                const data = getDataFromError(error);

                if (data && typeof data === 'object') {
                    const dataObj = data as Record<string, unknown>;

                    if (typeof dataObj.message === 'string') {
                        toast.error(dataObj.message);
                        return;
                    }

                    // Fluent Validation error Array labels
                    const fields = ['Username', 'Email', 'Password'] as const;
                    let errorShown = false;

                    fields.forEach(field => {
                        const fieldErrors = dataObj[field];
                        if (Array.isArray(fieldErrors)) {
                            fieldErrors.forEach((message) => {
                                // Replace any hardcoded field names in the message with the current field name
                                const formattedMessage = String(message).replace(/Username|Email|Password/g, field);
                                toast.error(formattedMessage);
                                errorShown = true;
                            });
                        }
                    });

                    if (!errorShown) {
                        toast.error('An error occurred.');
                    }
                    return;
                }

                if (typeof error === 'string') {
                    toast.error(error);
                    return;
                }

                if (error instanceof Error && error.message) {
                    toast.error(error.message);
                    return;
                }

                toast.error('An error occurred.');
            }
        }
    };

    const deleteUserHandler = async () => {
        try {
            const response = await deleteUser(userInfo.id).unwrap();
            dispatch(clearCredentials());
            navigate('/');
            toast.success(response.message);
        } catch (error: unknown) {
            // Safely extract response-like `.data` without using `any`
            const getDataFromError = (e: unknown): unknown => {
                if (typeof e !== 'object' || e === null) return null;
                const obj = e as Record<string, unknown>;
                if (obj.response && typeof obj.response === 'object' && obj.response !== null) {
                    const resp = obj.response as Record<string, unknown>;
                    return resp.data ?? null;
                }
                return obj.data ?? null;
            };

            const data = getDataFromError(error);

            if (data && typeof data === 'object') {
                const dataObj = data as Record<string, unknown>;

                if (typeof dataObj.message === 'string') {
                    toast.error(dataObj.message);
                    return;
                } else {
                    toast.error('An error occurred.');
                }
                return;
            }

            if (typeof error === 'string') {
                toast.error(error);
                return;
            }

            if (error instanceof Error && error.message) {
                toast.error(error.message);
                return;
            }

            toast.error('An error occurred.');
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
