import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../features/CartSlice";
import axios from "axios";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Cart() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const { cart } = useSelector((state) => state.cart);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (user?._id) dispatch(getCart(user._id));
    }, [user]);

    useEffect(() => {
        if (cart?.items) setItems(cart.items);
    }, [cart]);

    const updateQuantity = async (productId, newQty) => {
        if (newQty <= 0) return;
        await axios.post("http://localhost:5001/cart/update", { userId: user._id, productId, quantity: newQty });
        dispatch(getCart(user._id));
    };

    const removeItem = async (productId) => {
        await axios.delete(`http://localhost:5001/cart/remove/${user._id}/${productId}`);
        dispatch(getCart(user._id));
    };

    const total = items.reduce((sum, i) => sum + ((i.productId?.price || 0) * i.quantity), 0);

    if (!user?._id) return <Container className="text-center mt-5"><h3>Please login to view your cart</h3></Container>;

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "1100px" }}>
                <h2 style={{ fontWeight: "bold" }}>🛒 My Cart</h2>
                <hr />
                <Row>
                    <Col md="8">
                        {items.length === 0 ? (
                            <div className="text-center mt-5">
                                <h4>Your cart is empty</h4>
                                <Link to="/home"><Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '20px' }}>Browse Products</Button></Link>
                            </div>
                        ) : items.map((item) => (
                            <Card key={item.productId?._id} style={{ marginBottom: "20px", borderRadius: "12px", background: "white", padding: "12px" }}>
                                <Row>
                                    <Col md="3">
                                        <img src={item.productId?.image || "https://via.placeholder.com/150?text=💊"}
                                            style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "10px" }} />
                                    </Col>
                                    <Col md="6">
                                        <CardBody>
                                            <h5 style={{ fontWeight: "bold" }}>{item.productId?.name}</h5>
                                            <p style={{ color: '#888' }}>{item.productId?.manufacturer}</p>
                                            <h5 style={{ color: BTN_COLOR, fontWeight: "bold" }}>{item.productId?.price} OMR</h5>
                                            <div style={{ marginTop: "15px" }}>
                                                <Button color="secondary" size="sm" onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}><FaMinus /></Button>
                                                <span style={{ margin: "0 15px", fontSize: "18px", fontWeight: 'bold' }}>{item.quantity}</span>
                                                <Button color="secondary" size="sm" onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}><FaPlus /></Button>
                                            </div>
                                        </CardBody>
                                    </Col>
                                    <Col md="3" className="d-flex justify-content-center align-items-center">
                                        <Button color="danger" onClick={() => removeItem(item.productId?._id)}><FaTrash /></Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>

                    <Col md="4">
                        <Card style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
                            <h4 style={{ fontWeight: "bold" }}>Order Summary</h4>
                            <hr />
                            <p>Subtotal: <b>{total.toFixed(3)} OMR</b></p>
                            <p>Shipping: <b style={{ color: 'green' }}>Free</b></p>
                            <hr />
                            <h5>Total: <b style={{ color: BTN_COLOR }}>{total.toFixed(3)} OMR</b></h5>
                            <Link to="/checkout">
                                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: "20px", width: '100%', padding: '12px' }}
                                    disabled={items.length === 0}>
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Cart;
