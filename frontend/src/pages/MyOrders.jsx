import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "reactstrap";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function MyOrders() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);
    const [orders, setOrders] = useState([]);

    useEffect(() => { if (user?._id) loadOrders(); }, [user]);

    const loadOrders = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/orders/${user._id}`);
            setOrders(res.data);
        } catch (err) { console.log(err); }
    };

    const cancelOrder = async (id) => {
        try {
            await axios.post(`http://localhost:5001/order/cancel/${id}`);
            navigate("/order-cancelled", { state: { orderId: id } });
        } catch (err) { console.log(err); }
    };

    const statusColor = (s) => {
        if (s === "on_the_way") return "warning";
        if (s === "delivered") return "success";
        if (s === "cancelled") return "danger";
        return "secondary";
    };

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "900px" }}>
                <h2 style={{ fontWeight: "bold" }}>📋 My Orders</h2>
                <hr />
                {orders.length === 0 ? (
                    <div className="text-center mt-5">
                        <h4>No orders found</h4>
                        <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '20px' }} onClick={() => navigate("/home")}>Start Shopping</Button>
                    </div>
                ) : orders.map((o) => (
                    <Card key={o._id} style={{ padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                        <Row>
                            <Col md="8">
                                <h5>Order ID: {o._id}</h5>
                                <p>
                                    <b>Date:</b> {new Date(o.createdAt).toLocaleString()}<br />
                                    <b>Status:</b> <Badge color={statusColor(o.orderStatus)}>{o.orderStatus}</Badge><br />
                                    <b>Payment:</b> {o.paymentMethod || "cash"}<br />
                                    <b>Total:</b> <span style={{ color: BTN_COLOR, fontWeight: 'bold' }}>
                                        {(o.items.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0)).toFixed(3)} OMR
                                    </span>
                                </p>
                            </Col>
                            <Col md="4" className="d-flex flex-column align-items-center justify-content-center gap-2">
                                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', width: '100%', marginBottom: '8px' }}
                                    onClick={() => navigate(`/order/${o._id}`)}>View Order</Button>
                                <Button color="success" style={{ borderRadius: '20px', width: '100%', marginBottom: '8px' }}
                                    onClick={() => navigate(`/track-order/${o._id}`)}>Track</Button>
                                <Button color="danger" style={{ borderRadius: '20px', width: '100%' }}
                                    disabled={o.orderStatus === "cancelled"}
                                    onClick={() => cancelOrder(o._id)}>Cancel</Button>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </Container>
        </Container>
    );
}

export default MyOrders;
