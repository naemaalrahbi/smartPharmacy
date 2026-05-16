import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function MyList() {
    const { user } = useSelector((state) => state.users);
    const userKey = user?._id ? `fav_${user._id}` : "fav_guest";
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(userKey);
            if (saved) setFavorites(JSON.parse(saved));
        } catch { setFavorites([]); }
    }, [userKey]);

    useEffect(() => {
        axios.get("http://localhost:5001/products").then(res => setProducts(res.data));
    }, []);

    const favProducts = products.filter(p => favorites.includes(p._id));

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "1200px" }}>
                <Row className="mb-4">
                    <Col><h2 style={{ fontWeight: "bold" }}>❤️ My Favourite Medicines</h2></Col>
                </Row>
                <Row>
                    {favProducts.length === 0 ? (
                        <Col className="text-center mt-5">
                            <h4>No saved products</h4>
                            <Link to="/home"><Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '20px' }}>Browse Products</Button></Link>
                        </Col>
                    ) : favProducts.map((p) => (
                        <Col md="3" className="mb-4" key={p._id}>
                            <Card style={{ borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", background: "white" }}>
                                <img src={p.image || "https://via.placeholder.com/200x180?text=💊"}
                                    style={{ width: "100%", height: "180px", borderRadius: "16px 16px 0 0", objectFit: "cover" }} />
                                <CardBody>
                                    <CardTitle tag="h6" style={{ fontWeight: "bold" }}>{p.name}</CardTitle>
                                    <CardText>
                                        <small style={{ color: '#888' }}>{p.manufacturer}</small><br />
                                        <b style={{ color: BTN_COLOR }}>{p.price} OMR</b>
                                    </CardText>
                                    <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', width: '100%' }} tag={Link} to={`/product/${p._id}`}>
                                        View
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Container>
    );
}

export default MyList;
