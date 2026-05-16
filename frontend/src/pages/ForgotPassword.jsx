import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ForgotSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
});

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } =
        useForm({ resolver: yupResolver(ForgotSchema) });

    const sendLink = async () => {
        try {
            const res = await axios.post("http://localhost:5001/forgot-password", { email });
            if (res.data.message === "Email not found") {
                setError("Email not found");
            } else {
                // Save email for reset page
                localStorage.setItem("resetEmail", email);
                navigate("/reset-password");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh' }}>
            <Row className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <Col md='4' style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div className="text-center mb-3"><span style={{ fontSize: '50px' }}>🔑</span></div>
                    <h2 className='text-center' style={{ fontWeight: 'bold' }}>Reset Your Password</h2>
                    <p className="text-center text-muted">Enter your Email below and we will send you a verification code</p>

                    <FormGroup>
                        <Label>Email</Label>
                        <input type='email' className='form-control' placeholder='Enter your Email'
                            style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' }}
                            {...register('email', { value: email, onChange: (e) => { setEmail(e.target.value); setError(""); } })}
                        />
                        <p style={{ color: 'red', fontSize: '12px' }}>{errors.email?.message}</p>
                    </FormGroup>

                    <Button className='form-control' style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px', fontWeight: 'bold' }}
                        onClick={handleSubmit(sendLink)}>
                        Send Reset Link
                    </Button>

                    {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}

                    <p className="text-center mt-3">
                        <Link to='/login' style={{ color: BTN_COLOR }}>Back to Sign In</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default ForgotPassword;
