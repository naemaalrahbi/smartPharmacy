import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Landing() {
    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Row className="d-flex justify-content-center align-items-center w-100">
                <Col md="5" className="text-center" style={{ padding: '40px' }}>

                    {/* Logo */}
                    <div style={{
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: 'white', margin: '0 auto 30px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '60px' }}>💊</span>
                    </div>

                    <h1 style={{ fontWeight: 'bold', fontSize: '36px', marginBottom: '30px' }}>
                        Smart Pharmacy
                    </h1>

                    <div style={{ marginTop: '20px' }}>
                        <Link to="/about">
                            <Button style={{ background: BTN_COLOR, border: 'none', margin: '10px', width: '220px', borderRadius: '30px', padding: '14px', fontWeight: 'bold', fontSize: '16px' }}>
                                About Us
                            </Button>
                        </Link>

                        <Link to="/login">
                            <Button style={{ background: BTN_COLOR, border: 'none', margin: '10px', width: '220px', borderRadius: '30px', padding: '14px', fontWeight: 'bold', fontSize: '16px' }}>
                                Shop Now
                            </Button>
                        </Link>

                        <Link to="/admin/login">
                            <Button style={{ background: BTN_COLOR, border: 'none', margin: '10px', width: '220px', borderRadius: '30px', padding: '14px', fontWeight: 'bold', fontSize: '16px' }}>
                                Admin
                            </Button>
                        </Link>
                    </div>

                    <div style={{ marginTop: '40px', borderTop: `2px solid ${BTN_COLOR}`, display: 'flex' }}>
                        <Link to="/register" style={{ flex: 1, padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                            Sign Up
                        </Link>
                        <div style={{ width: '2px', background: BTN_COLOR }} />
                        <Link to="/login" style={{ flex: 1, padding: '15px', textAlign: 'center', fontWeight: 'bold', color: 'black', textDecoration: 'none', fontSize: '18px' }}>
                            Sign In
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Landing;
