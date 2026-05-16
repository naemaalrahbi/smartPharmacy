import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function About() {
    const navigate = useNavigate();
    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: '100vh', paddingTop: '40px' }}>
            <Row className="d-flex justify-content-center">
                <Col md="6" className="text-center">
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>💊</div>
                    <h2 style={{ fontWeight: 'bold', marginBottom: '20px' }}>About Us</h2>
                    <p style={{ fontSize: '18px', lineHeight: '32px', marginBottom: '20px' }}>
                        We are a pharmacy system company dedicated to providing the best possible service to our customers.
                        Our team of experienced professionals is committed to ensuring that every aspect of our service meets
                        or exceeds the highest standards.
                    </p>
                    <ul style={{ textAlign: 'left', fontSize: '16px', color: BTN_COLOR, fontWeight: 'bold', lineHeight: '36px' }}>
                        <li>Fast and reliable delivery of high-quality products.</li>
                        <li>Affordable prices for all medicines.</li>
                        <li>Friendly and knowledgeable staff.</li>
                        <li>24/7 customer support.</li>
                    </ul>
                    <Button
                        style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', padding: '12px 40px', marginTop: '20px', fontWeight: 'bold' }}
                        onClick={() => navigate("/login")}
                    >
                        Shop Now
                    </Button>
                    <br />
                    <Button color="secondary" className="mt-3" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default About;
