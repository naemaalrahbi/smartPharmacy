import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/UserSlice";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.users.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    if (!user || !user.email) return (
        <Container fluid className="text-center" style={{ background: PINK, height: "100vh", paddingTop: "100px" }}>
            <h3>No user logged in</h3>
            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '20px' }} onClick={() => navigate("/login")}>Go to Login</Button>
        </Container>
    );

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "600px" }}>
                <Card style={{ padding: "30px", borderRadius: "16px", background: "white", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
                    <div className="text-center mb-3"><span style={{ fontSize: '60px' }}>👤</span></div>
                    <h2 className="text-center mb-3" style={{ fontWeight: "bold" }}>Hi Dear!</h2>
                    <hr />
                    <p><b>Name:</b> {user.username}</p>
                    <p><b>Email:</b> {user.email}</p>
                    <p><b>Phone:</b> {user.phone}</p>
                    <p><b>Age:</b> {user.age}</p>
                    <hr />

                    <Row>
                        <Col md="6">
                            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', width: '100%', marginBottom: '10px' }}
                                onClick={() => navigate("/my-orders")}>My Orders</Button>
                        </Col>
                        <Col md="6">
                            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', width: '100%', marginBottom: '10px' }}
                                onClick={() => navigate("/my-list")}>My List</Button>
                        </Col>
                    </Row>

                    <Button color="danger" style={{ borderRadius: '20px', width: '100%', marginTop: '10px' }} onClick={handleLogout}>
                        Log Out
                    </Button>
                </Card>
            </Container>
        </Container>
    );
}

export default Profile;
