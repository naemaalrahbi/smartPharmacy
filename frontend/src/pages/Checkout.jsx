import { useEffect, useState } from "react";
import { Container, Row, Col, FormGroup, Label, Input, Button, Card } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../features/CartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckoutSchemaValidation } from "../validations/CheckoutSchemaValidation";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);
    const { cart } = useSelector((state) => state.cart);
    const [items, setItems] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        resolver: yupResolver(CheckoutSchemaValidation),
    });

    useEffect(() => { if (user?._id) dispatch(getCart(user._id)); }, [user]);
    useEffect(() => { if (cart?.items) setItems(cart.items); }, [cart]);

    const total = items.reduce((sum, i) => sum + (i.productId?.price || 0) * i.quantity, 0);

    const placeOrder = async (values) => {
        const orderData = {
            userId: user._id,
            items: items.map((i) => ({ productId: i.productId._id, quantity: i.quantity, price: i.productId.price })),
            total,
            fullname: values.fullname,
            phone: values.phone,
            address: values.address,
            city: values.city,
            notes: values.notes || "",
            orderStatus: "pending",
        };

        const res = await axios.post("https://smartpharmacy-lysm.onrender.com/order/create", orderData);
        const fullOrder = {
            ...res.data.order,
            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        };
        navigate("/payment", { state: { order: fullOrder } });
    };

    if (!user?._id) return <Container className="text-center mt-5"><h3>Please login to continue</h3></Container>;
    if (items.length === 0) return <Container className="text-center mt-5"><h3>Your cart is empty</h3></Container>;

    return (
        <Container fluid style={{ background: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "1100px" }}>
                <h2 style={{ fontWeight: "bold" }}>📦 Checkout</h2>
                <hr />
                <Row>
                    <Col md="7">
                        <Card style={{ padding: "25px", borderRadius: "16px" }}>
                            <h4>Delivery Information</h4><hr />
                            <FormGroup>
                                <Label>Full Name *</Label>
                                <Input name="fullname" placeholder="Enter full name" innerRef={register("fullname").ref} onChange={register("fullname").onChange} onBlur={register("fullname").onBlur} />
                                <p style={{ color: "red", fontSize: '12px' }}>{errors.fullname?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Phone *</Label>
                                <Input name="phone" placeholder="Enter phone number" innerRef={register("phone").ref} onChange={register("phone").onChange} onBlur={register("phone").onBlur} />
                                <p style={{ color: "red", fontSize: '12px' }}>{errors.phone?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Address *</Label>
                                <Input name="address" placeholder="Enter delivery address" innerRef={register("address").ref} onChange={register("address").onChange} onBlur={register("address").onBlur} />
                                <p style={{ color: "red", fontSize: '12px' }}>{errors.address?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>City *</Label>
                                <Input name="city" placeholder="Enter city" innerRef={register("city").ref} onChange={register("city").onChange} onBlur={register("city").onBlur} />
                                <p style={{ color: "red", fontSize: '12px' }}>{errors.city?.message}</p>
                            </FormGroup>
                            <FormGroup>
                                <Label>Notes (optional)</Label>
                                <Input type="textarea" name="notes" placeholder="Any special instructions?" innerRef={register("notes").ref} onChange={register("notes").onChange} onBlur={register("notes").onBlur} />
                            </FormGroup>
                        </Card>
                    </Col>
                    <Col md="5">
                        <Card style={{ padding: "20px", borderRadius: "16px" }}>
                            <h4>Order Summary</h4><hr />
                            {items.map((i) => (
                                <div key={i.productId?._id}>
                                    <b>{i.productId?.name}</b><br />
                                    Qty: {i.quantity} × {i.productId?.price} OMR
                                    <hr />
                                </div>
                            ))}
                            <h5>Total: <b style={{ color: BTN_COLOR }}>{total.toFixed(3)} OMR</b></h5>
                            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '20px', width: '100%', padding: '12px', fontWeight: 'bold' }}
                                onClick={handleSubmit(placeOrder)}>
                                Confirm & Pay
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Checkout;
