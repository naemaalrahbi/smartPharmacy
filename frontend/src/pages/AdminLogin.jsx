import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchemaValidation } from '../validations/LoginSchemaValidation';
import { useDispatch, useSelector } from 'react-redux';
import { getAdmin } from '../features/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message } = useSelector((state) => state.users);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(LoginSchemaValidation),
        mode: "onChange",
        defaultValues: { email: "", password: "" }
    });

    const email = watch("email");
    const password = watch("password");

    const loginAdmin = () => {
        dispatch(getAdmin({ email, password }));
    };

    useEffect(() => {
        if (message === "Success") navigate("/admin/products");
    }, [message]);

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh' }}>
            <Row className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <Col md='4' style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div className="text-center mb-3"><span style={{ fontSize: '50px' }}>🔐</span></div>
                    <h2 className='text-center' style={{ fontWeight: 'bold' }}>Admin Sign In</h2>

                    <FormGroup>
                        <Label>Email:</Label>
                        <input type='email' className='form-control' placeholder='Admin Email'
                            {...register('email')}
                            onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
                            style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' }}
                        />
                        <p style={{ color: 'red' }}>{errors.email?.message}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label>Password:</Label>
                        <input type='password' className='form-control' placeholder='Admin Password'
                            {...register('password')}
                            onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
                            style={{ borderRadius: '10px', background: '#f9e4e8', border: 'none', padding: '12px' }}
                        />
                        <p style={{ color: 'red' }}>{errors.password?.message}</p>
                    </FormGroup>

                    <Button className='form-control' style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px', fontWeight: 'bold' }}
                        onClick={handleSubmit(loginAdmin)}>
                        Sign In as Admin
                    </Button>

                    {message && message !== "Success" && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

                    <Button color="secondary" className="form-control mt-3" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminLogin;
