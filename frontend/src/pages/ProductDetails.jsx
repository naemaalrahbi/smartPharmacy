import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Badge } from "reactstrap";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/CartSlice";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const userKey = user?._id ? `fav_${user._id}` : "fav_guest";
    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem(userKey)) || []; } catch { return []; }
    });

    useEffect(() => { localStorage.setItem(userKey, JSON.stringify(favorites)); }, [favorites]);

    const loadProduct = async () => {
        const res = await axios.get("http://localhost:5001/products");
        const found = res.data.find((p) => p._id === id);
        setProduct(found);
        setAllProducts(res.data);
    };

    useEffect(() => { loadProduct(); }, [id]);

    if (!product) return <Container className="text-center mt-5"><h2>Loading...</h2></Container>;

    const similar = allProducts.filter(p => p.category === product.category && p._id !== product._id);

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: "100vh", padding: "40px" }}>
            <Container style={{ maxWidth: "1100px" }}>
                <Row>
                    <Col md="5">
                        <img src={product.image || "https://via.placeholder.com/400x300?text=💊"}
                            style={{ width: "100%", height: "350px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
                            alt={product.name}
                        />
                    </Col>
                    <Col md="7">
                        <h2 style={{ fontWeight: "bold" }}>{product.name}</h2>
                        <p style={{ color: "#888", fontSize: '16px' }}>By {product.manufacturer}</p>
                        <h3 style={{ fontWeight: "bold", color: BTN_COLOR }}>{product.price} OMR</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <Badge color="secondary" style={{ marginRight: '8px' }}>{product.category}</Badge>
                            {product.requiresPrescription && <Badge color="danger">Requires Prescription</Badge>}
                            {product.stock > 0
                                ? <Badge color="success" style={{ marginLeft: '8px' }}>In Stock ({product.stock})</Badge>
                                : <Badge color="danger" style={{ marginLeft: '8px' }}>Out of Stock</Badge>
                            }
                        </div>

                        {product.description && <p style={{ color: '#555', lineHeight: '28px' }}>{product.description}</p>}

                        <Row style={{ marginTop: "20px", alignItems: 'center' }}>
                            <Col md="2" className="text-center">
                                {favorites.includes(product._id)
                                    ? <FaHeart size={30} style={{ cursor: "pointer", color: "red" }} onClick={() => setFavorites(favorites.filter(f => f !== product._id))} />
                                    : <FaRegHeart size={30} style={{ cursor: "pointer" }} onClick={() => setFavorites([...favorites, product._id])} />
                                }
                            </Col>
                            <Col md="10">
                                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', width: '100%', padding: '12px', fontSize: '16px' }}
                                    onClick={() => {
                                        if (!user?._id) { alert("Please login first!"); return; }
                                        dispatch(addToCart({ userId: user._id, productId: product._id, quantity: 1 }));
                                        alert("Added to cart! 🛒");
                                    }}>
                                    <FaShoppingCart /> Add to Cart
                                </Button>
                            </Col>
                        </Row>

                        <Link to="/home">
                            <Button color="secondary" style={{ marginTop: "20px" }}>← Back to Products</Button>
                        </Link>
                    </Col>
                </Row>

                {similar.length > 0 && (
                    <>
                        <h3 style={{ marginTop: "50px", fontWeight: "bold" }}>Similar Products</h3>
                        <Row className="mt-3">
                            {similar.slice(0, 4).map((p) => (
                                <Col md="3" key={p._id} className="mb-4">
                                    <Card style={{ borderRadius: "12px", background: "white" }}>
                                        <img src={p.image || "https://via.placeholder.com/200x160?text=💊"}
                                            style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                                            alt={p.name}
                                        />
                                        <CardBody>
                                            <CardTitle tag="h6" style={{ fontWeight: "bold" }}>{p.name}</CardTitle>
                                            <p style={{ color: BTN_COLOR, fontWeight: 'bold' }}>{p.price} OMR</p>
                                            <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', width: '100%' }}
                                                tag={Link} to={`/product/${p._id}`}>
                                                View
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </Container>
        </Container>
    );
}

export default ProductDetails;
