import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../features/ProductSlice";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { addToCart } from "../features/CartSlice";

const PINK = "#FFE4E8";
const BTN_COLOR = "#C27B8A";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.users);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState("");

    const userKey = user?._id ? `fav_${user._id}` : "fav_guest";
    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem(userKey)) || []; }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem(userKey, JSON.stringify(favorites));
    }, [favorites]);

    const toggleFav = (id) => {
        setFavorites(favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id]);
    };

    useEffect(() => {
        dispatch(getProducts());
    }, []);

    // ============================
    // LOCATION-BASED SERVICE
    // ============================
    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setLocation({ lat: latitude, lng: longitude });
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    setLocationName(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                } catch {
                    setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
            },
            () => alert("Unable to retrieve your location")
        );
    };

    const filtered = products?.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container fluid style={{ backgroundColor: PINK, minHeight: "100vh", padding: "30px" }}>
            <Container style={{ maxWidth: "1200px" }}>
                {/* HEADER */}
                <Row className="mb-3 align-items-center">
                    <Col md="5">
                        <h2 style={{ fontWeight: "bold" }}>💊 Smart Pharmacy</h2>
                    </Col>
                    <Col md="5">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search medicines..." style={{ borderRadius: '30px', padding: '10px 20px', background: 'white', border: 'none' }}
                        />
                    </Col>
                    <Col md="2" className="text-end">
                        <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '20px', padding: '8px 16px' }}
                            onClick={getLocation}>
                            <FaMapMarkerAlt /> Add Location
                        </Button>
                    </Col>
                </Row>

                {/* LOCATION DISPLAY */}
                {locationName && (
                    <Row className="mb-3">
                        <Col>
                            <div style={{ background: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
                                <FaMapMarkerAlt color={BTN_COLOR} /> <b>Your Location:</b> {locationName}
                            </div>
                        </Col>
                    </Row>
                )}

                {/* HERO BANNER */}
                <Row className="mb-4">
                    <Col>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            <span style={{ fontSize: '60px' }}>🏥</span>
                            <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Your trusted online pharmacy - Fast & Reliable</p>
                        </div>
                    </Col>
                </Row>

                {/* PRODUCT CARDS */}
                <Row>
                    {filtered && filtered.length > 0 ? (
                        filtered.map((product) => (
                            <Col md="3" className="mb-4" key={product._id}>
                                <Card style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: 'white', height: '100%' }}>
                                    <img
                                        src={product.image || "https://via.placeholder.com/200x180?text=💊"}
                                        style={{ width: '100%', height: '180px', borderRadius: '16px 16px 0 0', objectFit: 'cover' }}
                                        alt={product.name}
                                    />
                                    <CardBody>
                                        <CardTitle tag="h6" style={{ fontWeight: 'bold', minHeight: '40px' }}>
                                            {product.name}
                                        </CardTitle>
                                        <CardText>
                                            <small style={{ color: '#888' }}>{product.manufacturer}</small><br />
                                            <b style={{ fontSize: '16px', color: BTN_COLOR }}>{product.price} OMR</b>
                                            {product.requiresPrescription && (
                                                <span style={{ marginLeft: '8px', fontSize: '11px', background: '#ffdddd', color: 'red', padding: '2px 6px', borderRadius: '8px' }}>Rx</span>
                                            )}
                                        </CardText>

                                        <Row className="align-items-center">
                                            <Col>
                                                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '10px', width: '100%', fontSize: '13px' }}
                                                    tag={Link} to={`/product/${product._id}`}>
                                                    View
                                                </Button>
                                            </Col>
                                            <Col className="text-center">
                                                {favorites.includes(product._id)
                                                    ? <FaHeart size={22} style={{ cursor: 'pointer', color: 'red' }} onClick={() => toggleFav(product._id)} />
                                                    : <FaRegHeart size={22} style={{ cursor: 'pointer' }} onClick={() => toggleFav(product._id)} />
                                                }
                                            </Col>
                                            <Col>
                                                <Button style={{ background: '#28a745', border: 'none', borderRadius: '10px', width: '100%' }}
                                                    onClick={() => {
                                                        if (!user?._id) { alert("Please login first!"); return; }
                                                        dispatch(addToCart({ userId: user._id, productId: product._id, quantity: 1 }));
                                                        alert("Added to cart! 🛒");
                                                    }}>
                                                    <FaShoppingCart />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center mt-5">
                            <h4>No products found</h4>
                        </Col>
                    )}
                </Row>
            </Container>
        </Container>
    );
}

export default Home;
