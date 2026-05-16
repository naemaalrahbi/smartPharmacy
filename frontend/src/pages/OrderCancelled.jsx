import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "reactstrap";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function OrderCancelled() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId;

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", paddingTop: "80px", textAlign: "center" }}>
            <div style={{ background: 'white', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                ✅
            </div>
            <h2 style={{ fontWeight: "bold" }}>The Order Has Been Cancelled!</h2>
            {orderId && <p style={{ color: '#888' }}>Order ID: {orderId}</p>}
            <div style={{ marginTop: "30px" }}>
                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', margin: '10px', padding: '12px 30px' }} onClick={() => navigate("/home")}>
                    Go to Home
                </Button>
                <Button color="secondary" style={{ borderRadius: '30px', margin: '10px', padding: '12px 30px' }} onClick={() => navigate("/my-orders")}>
                    My Orders
                </Button>
            </div>
        </Container>
    );
}

export default OrderCancelled;
