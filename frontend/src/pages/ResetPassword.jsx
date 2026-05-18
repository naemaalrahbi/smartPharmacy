import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

const ResetSchema = yup.object().shape({
    password: yup
        .string()
        .min(8, "At least 8 characters")
        .max(12, "Maximum 12 characters")
        .matches(/[a-z]/, "One lowercase letter")
        .matches(/[A-Z]/, "One uppercase letter")
        .matches(/[0-9]/, "One number")
        .matches(/[^a-zA-Z0-9]/, "One special character")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], "Passwords do not match")
        .required("Please confirm your password"),
});

function ResetPassword() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState("");
    const [serverMsg, setServerMsg] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } =
        useForm({ resolver: yupResolver(ResetSchema), mode: "onChange" });

    const password = watch("password") || "";

    const checks = [
        { label: "8-12 characters", valid: password.length >= 8 && password.length <= 12 },
        { label: "One lowercase letter", valid: /[a-z]/.test(password) },
        { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "One number", valid: /[0-9]/.test(password) },
        { label: "One special character", valid: /[^a-zA-Z0-9]/.test(password) },
    ];

    const submitReset = async (values) => {
        try {
            const email = localStorage.getItem("resetEmail");
            if (!email) {
                setServerMsg("Session expired. Please try again.");
                return;
            }
            const res = await axios.post("https://smartpharmacy-lysm.onrender.com/reset-password", {
                email,
                newPassword: values.password
            });
            if (res.data.message === "Password updated") {
                setSuccess("Password updated successfully!");
                localStorage.removeItem("resetEmail");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setServerMsg(res.data.message);
            }
        } catch {
            setServerMsg("Something went wrong. Please try again.");
        }
    };

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh' }}>
            <Row className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <Col md='4' style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>

                    <Link to="/forgot" style={{ color: BTN_COLOR, fontWeight: 'bold', textDecoration: 'none' }}>← Back</Link>

                    <h2 className='text-center mt-3' style={{ fontWeight: 'bold' }}>Reset Password</h2>

                    {/* PASSWORD */}
                    <FormGroup className="mt-3">
                        <Label>Password</Label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                className='form-control'
                                placeholder='8-12 chars: upper, lower, digit, symbol'
                                style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px', paddingRight: '40px' }}
                                {...register('password')}
                            />
                            <span
                                onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </span>
                        </div>

                        {/* PASSWORD CHECKLIST */}
                        <div style={{ marginTop: '10px' }}>
                            {checks.map((c, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                    <div style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        border: `2px solid ${c.valid ? BTN_COLOR : '#ccc'}`,
                                        background: c.valid ? BTN_COLOR : 'transparent',
                                        marginRight: '8px', flexShrink: 0
                                    }} />
                                    <small style={{ color: c.valid ? BTN_COLOR : '#aaa' }}>{c.label}</small>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'red', fontSize: '12px' }}>{errors.password?.message}</p>
                    </FormGroup>

                    {/* CONFIRM PASSWORD */}
                    <FormGroup>
                        <Label>Confirm password</Label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className='form-control'
                                placeholder='Confirm your password'
                                style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px', paddingRight: '40px' }}
                                {...register('confirmPassword')}
                            />
                            <span
                                onClick={() => setShowConfirm(!showConfirm)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                            >
                                {showConfirm ? '🙈' : '👁️'}
                            </span>
                        </div>
                        <p style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword?.message}</p>
                    </FormGroup>

                    <Button
                        className='form-control'
                        style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px', fontWeight: 'bold' }}
                        onClick={handleSubmit(submitReset)}
                    >
                        Update password
                    </Button>

                    {success && <p style={{ color: 'green', marginTop: '10px', textAlign: 'center' }}>✅ {success}</p>}
                    {serverMsg && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{serverMsg}</p>}

                    <p className="text-center mt-3">
                        <Link to='/login' style={{ color: BTN_COLOR, fontWeight: 'bold' }}>Back to login</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPassword;
