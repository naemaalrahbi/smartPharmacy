import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchemaValidation } from '../validations/LoginSchemaValidation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../features/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, message } = useSelector((state) => state.users);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(LoginSchemaValidation),
        mode: "onChange",
        defaultValues: { email: "", password: "" }
    });

    const email = watch("email");
    const password = watch("password");

    const loginUser = () => {
        dispatch(getUser({ email, password }));
    };

    useEffect(() => {
        if (message === "Success") navigate("/home");
    }, [message]);

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh' }}>
            <Row className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <Col md='4' style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div className="text-center mb-3"><span style={{ fontSize: '50px' }}>💊</span></div>
                    <h2 className='text-center' style={{ fontWeight: 'bold' }}>User Sign In</h2>

                    <FormGroup>
                        <Label>Email:</Label>
                        <input type='email' className='form-control' placeholder='Enter your Email'
                            {...register('email')}
                            onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
                            style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' }}
                        />
                        <p style={{ color: 'red' }}>{errors.email?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Password:</Label>
                        <input type='password' className='form-control' placeholder='Enter your Password'
                            {...register('password')}
                            onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
                            style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' }}
                        />
                        <p style={{ color: 'red' }}>{errors.password?.message}</p>
                    </FormGroup>

                    <div className="text-end mb-3">
                        <Link to='/forgot' style={{ color: BTN_COLOR }}>Forgot Password?</Link>
                    </div>

                    <Button className='form-control' style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px', fontWeight: 'bold' }}
                        onClick={handleSubmit(loginUser)}>
                        Sign In
                    </Button>

                    {message && message !== "Success" && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

                    <p className='text-center mt-3'>
                        Don't have an account? <Link to='/register' style={{ color: BTN_COLOR, fontWeight: 'bold' }}>Sign Up</Link>
                    </p>

                    <Button color="secondary" className="form-control mt-2" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
