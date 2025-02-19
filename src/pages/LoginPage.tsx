import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { RootState } from '../store';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/esm/Card';
import Form from 'react-bootstrap/esm/Form';
import Loader from '../components/Loader';
import type UserType from '../types/UserType';

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, {isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const [cred, setCred] = useState('');
    const [pwd, setPwd] = useState('');
    const [credTouched, setCredTouched] = useState(false);
    const [pwdTouched, setPwdTouched] = useState(false);

    const handleCredInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setCred(evt.target.value);
        setCredTouched(true);
    };

    const handlePwdInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setPwd(evt.target.value);
        setPwdTouched(true);
    };

    let credential = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(cred)) {
        credential = {email: cred};
    } else {
        credential = {username: cred};
    }

    const formData: UserType = {
        ...credential,
        password: pwd
    }

    const loginHandler = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        
        try {
            const response = await login(formData).unwrap();
            dispatch(setCredentials({...response}));
            navigate('/');
        } catch (error: any) {
            toast.error(error.data.message || "An error occurred.");
        }
    };

    return (
        <Container className="mx-auto mt-5">
            <Card className="mx-auto" style={{ width: '20rem' }}>
                <Card.Body>

                    <Card.Title className="lg mb-3">Please sign in</Card.Title>

                    <Form onSubmit={loginHandler}>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username or Email</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Email address or username"
                                value={cred}
                                onChange={handleCredInputChange}
                                required
                                isInvalid={!cred && credTouched} />
                            <Form.Control.Feedback type="invalid">Please enter your login.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={pwd}
                                onChange={handlePwdInputChange}
                                required
                                isInvalid={!pwd && pwdTouched} />
                            <Form.Control.Feedback type="invalid">Please enter your password.</Form.Control.Feedback>
                        </Form.Group>

                        <Button 
                            variant="secondary"
                            type="submit"
                            style={{ height: '38px', width: '75px' }}>
                                {isLoading ? <Loader /> : 'Sign in'}
                        </Button>

                    </Form>

                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginPage;
