import { Container, Button, Card } from "reactstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    if (!order) return <Container className="text-center mt-5"><h3>No order data found</h3></Container>;

    const total = order.items.reduce((sum, i) => sum + ((i.productId?.price || 0) * i.quantity), 0);

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "600px" }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ background: 'white', width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        ✅
                    </div>
                    <h2 style={{ fontWeight: "bold" }}>Payment is Done!</h2>
                    <p style={{ fontSize: "18px", color: '#555' }}>Your order has been placed successfully.</p>
                </div>

                <Card style={{ padding: "25px", borderRadius: "16px" }}>
                    <h4>Order Summary</h4><hr />
                    {order.items.map((item, i) => (
                        <div key={i} style={{ marginBottom: "12px" }}>
                            <b>{item.productId?.name}</b><br />
                            Qty: {item.quantity} × {item.productId?.price} OMR
                            <hr />
                        </div>
                    ))}
                    <h4>Total: <b style={{ color: BTN_COLOR }}>{total.toFixed(3)} OMR</b></h4>
                </Card>

                <div className="text-center mt-4" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold' }} onClick={() => navigate("/my-orders")}>OK</p>
                </div>
            </Container>
        </Container>
    );
}

export default PaymentSuccess;
