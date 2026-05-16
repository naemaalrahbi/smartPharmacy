import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Badge } from "reactstrap";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/order/details/${id}`);
            setOrder(res.data);
        } catch (err) { console.log(err); }
    };

    if (!order) return <Container className="text-center mt-5"><h4>Loading order...</h4></Container>;

    const total = order.items.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0);

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "900px" }}>
                <h2 style={{ fontWeight: "bold" }}>Order Details</h2><hr />

                <Card style={{ padding: "20px", borderRadius: "12px", marginBottom: '20px' }}>
                    <h4>Products</h4><hr />
                    {order.items.map((item, i) => (
                        <Row key={i} className="mb-3">
                            <Col md="3">
                                <img src={item.productId?.image || "https://via.placeholder.com/120?text=💊"}
                                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "10px" }} />
                            </Col>
                            <Col md="9">
                                <h5>{item.productId?.name}</h5>
                                <p>Qty: {item.quantity}<br />Price: {item.productId?.price} OMR</p>
                            </Col>
                        </Row>
                    ))}
                    <hr />
                    <h4>Total: <b style={{ color: BTN_COLOR }}>{total.toFixed(3)} OMR</b></h4>
                </Card>

                <Card style={{ padding: "20px", borderRadius: "12px" }}>
                    <h4>Order Information</h4><hr />
                    <p><b>Order ID:</b> {order._id}</p>
                    <p><b>Status:</b> <Badge color={order.orderStatus === "cancelled" ? "danger" : "warning"}>{order.orderStatus}</Badge></p>
                    <p><b>Payment:</b> {order.paymentMethod || "cash"}</p>
                    <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
                    {order.fullname && <p><b>Delivery To:</b> {order.fullname}, {order.address}, {order.city}</p>}
                </Card>

                <div className="mt-4 d-flex justify-content-between">
                    <Button color="secondary" style={{ borderRadius: '20px' }} onClick={() => navigate("/home")}>Home</Button>
                    <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px' }} onClick={() => navigate("/my-orders")}>My Orders</Button>
                </div>
            </Container>
        </Container>
    );
}

export default OrderDetails;
