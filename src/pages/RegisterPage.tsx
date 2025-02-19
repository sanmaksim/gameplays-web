import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { RootState } from '../store';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/esm/Form';
import Loader from '../components/Loader';
import type UserType from '../types/UserType';

function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, {isLoading}] = useRegisterMutation();

    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const [un, setUn] = useState('');
    const [mail, setMail] = useState('');
    const [pwd, setPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [unTouched, setUnTouched] = useState(false);
    const [mailTouched, setMailTouched] = useState(false);
    const [pwdTouched, setPwdTouched] = useState(false);
    const [confirmPwdTouched, setConfirmPwdTouched] = useState(false);

    const handleUnInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setUn(evt.target.value);
        setUnTouched(true);
    };

    const handleMailInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setMail(evt.target.value);
        setMailTouched(true);
    };

    const handlePwdInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setPwd(evt.target.value);
        setPwdTouched(true);
    };
    
    const handleConfirmPwdInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setConfirmPwd(evt.target.value);
        setConfirmPwdTouched(true);
    }

    const formData: UserType = {
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
                const response = await register(formData).unwrap();
                dispatch(setCredentials({...response}));
                navigate('/');
            } catch (error: any) {
                toast.error(error.data.message || "An error occurred.");
            }
        }
    };

    return (
        <Container className="mx-auto mt-5">
            <Card className="mx-auto" style={{ width: '20rem' }}>
                <Card.Body>

                    <Card.Title className="lg mb-3">Sign up with Gameplays</Card.Title>

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
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={pwd}
                                onChange={handlePwdInputChange}
                                required
                                isInvalid={!pwd && pwdTouched} />
                            <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPwd}
                                onChange={handleConfirmPwdInputChange}
                                required
                                isInvalid={!confirmPwd && confirmPwdTouched} />
                            <Form.Control.Feedback type="invalid">Please confirm your password.</Form.Control.Feedback>
                        </Form.Group>

                        {isLoading && <Loader />}

                        <Button variant="primary" type="submit">
                            Register
                        </Button>

                    </Form>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterPage;
