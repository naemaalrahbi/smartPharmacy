import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterSchemaValidation } from '../validations/RegisterSchemaValidation';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../features/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";
const inputStyle = { borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' };

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const message = useSelector((state) => state.users.message);

    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(RegisterSchemaValidation) });

    const registerUser = async () => {
        const data = { username, email, phone, age, password };
        try {
            const result = await dispatch(addUser(data)).unwrap();
            if (result?.message === "Registered") {
                navigate("/login");
            } else {
                alert(result?.message || "Registration failed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh' }}>
            <Row className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <Col md='4' style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', margin: '40px auto' }}>
                    <div className="text-center mb-3"><span style={{ fontSize: '50px' }}>💊</span></div>
                    <h2 className='text-center' style={{ fontWeight: 'bold' }}>Register New User</h2>

                    <FormGroup>
                        <Label>User Name:</Label>
                        <input type='text' className='form-control' placeholder='Enter username' style={inputStyle}
                            {...register('username', { value: username, onChange: (e) => setUsername(e.target.value) })}
                        />
                        <p style={{ color: 'red' }}>{errors.username?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Email:</Label>
                        <input type='email' className='form-control' placeholder='Enter your Email' style={inputStyle}
                            {...register('email', { value: email, onChange: (e) => setEmail(e.target.value) })}
                        />
                        <p style={{ color: 'red' }}>{errors.email?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Phone Number:</Label>
                        <input type='text' className='form-control' placeholder='Enter phone number' style={inputStyle}
                            {...register('phone', { value: phone, onChange: (e) => setPhone(e.target.value) })}
                        />
                        <p style={{ color: 'red' }}>{errors.phone?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Age:</Label>
                        <input type='number' className='form-control' placeholder='Enter your age' style={inputStyle}
                            {...register('age', { value: age, onChange: (e) => setAge(e.target.value) })}
                        />
                        <p style={{ color: 'red' }}>{errors.age?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Password:</Label>
                        <input type='password' className='form-control' placeholder='Enter Strong Password' style={inputStyle}
                            {...register('password', { value: password, onChange: (e) => setPassword(e.target.value) })}
                        />
                        <p style={{ color: 'red' }}>{errors.password?.message}</p>
                    </FormGroup>

                    <Button className='form-control' style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px', fontWeight: 'bold' }}
                        onClick={handleSubmit(registerUser)}>
                        Sign Up
                    </Button>

                    {message && message !== "Registered" && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

                    <p className='text-center mt-3'>
                        Already have an account? <Link to='/login' style={{ color: BTN_COLOR, fontWeight: 'bold' }}>Sign In</Link>
                    </p>

                    <Button color="secondary" className="form-control mt-2" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
