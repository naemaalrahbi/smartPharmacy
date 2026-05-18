import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, FormGroup, Label, Input, Button } from "reactstrap";

const PINK = "#FFE4E8";
const BTN_COLOR = "#8B1A1A";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;
    const user = useSelector((state) => state.users.user);

    const [method, setMethod] = useState("cash");
    const [cardNum, setCardNum] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [errors, setErrors] = useState({});

    if (!order) return <Container className="text-center mt-5"><h3>No order found</h3></Container>;

    const validateFields = () => {
        let err = {};
        if (method === "card") {
            if (!cardNum.trim()) err.cardNum = "Card number is required";
            else if (cardNum.replace(/\s/g, '').length < 16) err.cardNum = "Card number must be 16 digits";
            if (!cardName.trim()) err.cardName = "Name on card is required";
            if (!expiry.trim()) err.expiry = "Expiry date required";
            if (!cvv.trim()) err.cvv = "CVV is required";
            else if (cvv.length < 3) err.cvv = "Invalid CVV";
        }
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const total = order.items.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0);

    const payNow = async () => {
        if (!validateFields()) return;

        try {
            await axios.delete(`https://smartpharmacy-lysm.onrender.com/cart/removeall/${user._id}`);
            const populated = await axios.get(`https://smartpharmacy-lysm.onrender.com/order/details/${order._id}`);
            navigate("/payment-success", { state: { order: populated.data } });
        } catch (err) {
            console.log(err);
            alert("Something went wrong while processing payment.");
        }
    };

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "900px" }}>
                <h2 style={{ fontWeight: "bold" }}>💳 Payment Details</h2>
                <hr />
                <Row>
                    <Col md="6">
                        <Card style={{ padding: "20px", borderRadius: "16px" }}>
                            <h4>Payment Method</h4>
                            <div style={{ marginBottom: '15px' }}>
                              <img
    src="https://cdn-icons-png.flaticon.com/512/196/196578.png"
    style={{ height: '30px', marginRight: '10px' }}
    alt="Visa"
/>

<img
    src="https://cdn-icons-png.flaticon.com/512/0/747.png"
    style={{ height: '25px' }}
    alt="Apple Pay"
/>
                            </div>
                            <FormGroup check>
                                <Label check><Input type="radio" name="payment" checked={method === "cash"} onChange={() => setMethod("cash")} /> Cash on Delivery</Label>
                            </FormGroup>
                            <FormGroup check className="mt-2">
                                <Label check><Input type="radio" name="payment" checked={method === "card"} onChange={() => setMethod("card")} /> Card Payment</Label>
                            </FormGroup>

                            {method === "card" && (
                                <div style={{ marginTop: "20px" }}>
                                    <FormGroup>
                                        <Label>Name on Card</Label>
                                        <Input value={cardName} onChange={(e) => { setCardName(e.target.value); setErrors(p => ({ ...p, cardName: "" })); }} placeholder="John Smith" />
                                        <p style={{ color: "red", fontSize: '12px' }}>{errors.cardName}</p>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Card Number</Label>
                                        <Input value={cardNum} onChange={(e) => { setCardNum(e.target.value); setErrors(p => ({ ...p, cardNum: "" })); }} placeholder="0000 0000 0000 0000" maxLength="19" />
                                        <p style={{ color: "red", fontSize: '12px' }}>{errors.cardNum}</p>
                                    </FormGroup>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label>Exp Date</Label>
                                                <Input value={expiry} onChange={(e) => { setExpiry(e.target.value); setErrors(p => ({ ...p, expiry: "" })); }} placeholder="00/0000" />
                                                <p style={{ color: "red", fontSize: '12px' }}>{errors.expiry}</p>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label>CVV</Label>
                                                <Input value={cvv} onChange={(e) => { setCvv(e.target.value); setErrors(p => ({ ...p, cvv: "" })); }} placeholder="000" type="password" maxLength="4" />
                                                <p style={{ color: "red", fontSize: '12px' }}>{errors.cvv}</p>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '10px', marginTop: '10px', padding: '14px', fontSize: '18px', fontWeight: 'bold', width: '100%' }}
                                onClick={payNow}>
                                Pay {total.toFixed(3)} OMR
                            </Button>
                        </Card>
                    </Col>

                    <Col md="6">
                        <Card style={{ padding: "20px", borderRadius: "16px" }}>
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
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Payment;
