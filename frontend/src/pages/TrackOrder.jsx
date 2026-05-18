import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, CardBody, Row, Col } from "reactstrap";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function TrackOrder() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    const steps = ["pending", "confirmed", "on_the_way", "out for delivery", "delivered"];

    useEffect(() => { loadOrder(); }, []);

    const loadOrder = async () => {
        try {
            const res = await axios.get(`https://smartpharmacy-lysm.onrender.com/order/details/${id}`);
            setOrder(res.data);
        } catch (err) { console.log(err); }
    };

    if (!order) return <Container className="mt-5 text-center"><h3>Loading order...</h3></Container>;

    const currentStatus = order.orderStatus?.toLowerCase();
    const currentIndex = steps.indexOf(currentStatus);

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "900px" }}>
                <h2 style={{ fontWeight: "bold" }}>📍 Track Order</h2><hr />

                <Card style={{ padding: "20px", borderRadius: "16px", marginBottom: '20px', background: BTN_COLOR, color: 'white' }}>
                    <h4 style={{ margin: 0 }}>
                        {currentStatus === "delivered" ? "✅ Delivered!" : `⏱ ${currentStatus === "on_the_way" ? "5 min left — In a way......" : currentStatus}`}
                    </h4>
                </Card>

                <Card style={{ padding: "20px", borderRadius: "16px" }}>
                    <CardBody>
                        <h4>Order Progress</h4>
                        <Row className="mt-4">
                            {steps.map((s, index) => {
                                const isDone = index <= currentIndex;
                                return (
                                    <Col key={s} className="text-center" style={{ marginBottom: "20px" }}>
                                        <div style={{
                                            width: "40px", height: "40px", borderRadius: "50%", margin: "0 auto",
                                            background: isDone ? BTN_COLOR : "#ddd",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: "white", fontWeight: "bold", fontSize: '16px'
                                        }}>
                                            {isDone ? "✓" : index + 1}
                                        </div>
                                        <small style={{ display: "block", marginTop: "8px", fontWeight: isDone ? "bold" : "normal", textTransform: "capitalize", fontSize: '11px' }}>
                                            {s.replace(/_/g, ' ')}
                                        </small>
                                    </Col>
                                );
                            })}
                        </Row>

                        <hr />
                        <h4>Items</h4>
                        {order.items.map((item, i) => (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <b>{item.productId?.name}</b> — Qty: {item.quantity}<br />
                                {item.productId?.price} OMR
                                <hr />
                            </div>
                        ))}
                        <h4>Total: <b style={{ color: BTN_COLOR }}>
                            {order.items.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0).toFixed(3)} OMR
                        </b></h4>
                    </CardBody>
                </Card>
            </Container>
        </Container>
    );
}

export default TrackOrder;
