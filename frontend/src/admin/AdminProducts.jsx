import { useEffect, useState } from "react";import { Container, Row, Col, FormGroup, Label, Button, Table, Modal, ModalHeader, ModalBody, Badge } from "reactstrap";import axios from "axios";import { Link } from "react-router-dom";

const BTN_COLOR = "#C27B8A";

function AdminProducts() {const [name, setName] = useState("");const [manufacturer, setManufacturer] = useState("");const [price, setPrice] = useState("");const [image, setImage] = useState("");const [category, setCategory] = useState("General");const [stock, setStock] = useState("");const [requiresPrescription, setRequiresPrescription] = useState(false);const [description, setDescription] = useState("");

const [errors, setErrors] = useState({});
const [products, setProducts] = useState([]);
const [serverMsg, setServerMsg] = useState("");

const [editId, setEditId] = useState(null);
const [editData, setEditData] = useState({});
const [editErrors, setEditErrors] = useState({});
const [modal, setModal] = useState(false);
const toggle = () => setModal(!modal);

const loadProducts = async () => {
    const res = await axios.get(
        "https://smartpharmacy-lysm.onrender.com/products"
    );

    setProducts(res.data);
};

useEffect(() => { loadProducts(); }, []);

const validateAdd = () => {
    let err = {};
    if (!name.trim()) err.name = "Product name is required";
    if (!manufacturer.trim()) err.manufacturer = "Manufacturer is required";
    if (!price) err.price = "Price is required";
    else if (Number(price) <= 0) err.price = "Price must be greater than 0";
    if (stock !== "" && Number(stock) < 0) err.stock = "Stock cannot be negative";
    setErrors(err);
    return Object.keys(err).length === 0;
};

const addProduct = async () => {
    if (!validateAdd()) return;
    const res = await axios.post("https://smartpharmacy-lysm.onrender.com/product/add", {
        name, manufacturer, price: Number(price), image, category,
        stock: Number(stock) || 0, requiresPrescription, description
    });
    setServerMsg(res.data.message);
    if (res.data.message === "Product Added") {
        setName(""); setManufacturer(""); setPrice(""); setImage("");
        setCategory("General"); setStock(""); setRequiresPrescription(false); setDescription("");
        setErrors({});
        loadProducts();
    }
};

const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        await axios.delete(`https://smartpharmacy-lysm.onrender.com/product/delete/${id}`);
        loadProducts();
    }
};

const openEdit = (p) => {
    setEditId(p._id);
    setEditData({ name: p.name, manufacturer: p.manufacturer, price: p.price, image: p.image, category: p.category, stock: p.stock, requiresPrescription: p.requiresPrescription, description: p.description });
    setEditErrors({});
    toggle();
};

const validateEdit = () => {
    let err = {};
    if (!editData.name?.trim()) err.name = "Name required";
    if (!editData.manufacturer?.trim()) err.manufacturer = "Manufacturer required";
    if (!editData.price) err.price = "Price required";
    else if (Number(editData.price) <= 0) err.price = "Price must be > 0";
    setEditErrors(err);
    return Object.keys(err).length === 0;
};

const updateProduct = async () => {
    if (!validateEdit()) return;
    const res = await axios.put(`https://smartpharmacy-lysm.onrender.com/product/update/${editId}`, editData);
    if (res.data.message === "Updated") { toggle(); loadProducts(); }
    else alert(res.data.message);
};

return (
    <Container fluid style={{ background: "#FFE4E8", minHeight: "100vh" }}>
        <Row>
            <Col md="12" style={{ padding: "20px" }}>
                <Link to="/"><Button color="secondary">← Back to Website</Button></Link>
                <h3 style={{ display: 'inline-block', marginLeft: '20px' }}>🔐 Admin Panel - Products</h3>
            </Col>
        </Row>

        <Row>
            {/* ADD FORM */}
            <Col md="4" style={{ background: "white", margin: "20px", padding: "20px", borderRadius: "16px" }}>
                <h4>Add New Product</h4>

                {serverMsg && <p style={{ color: serverMsg === "Product Added" ? 'green' : 'red' }}>{serverMsg}</p>}

                <FormGroup>
                    <Label>Product Name *</Label>
                    <input className="form-control" value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }} />
                    <p style={{ color: "red", fontSize: '12px' }}>{errors.name}</p>
                </FormGroup>

                <FormGroup>
                    <Label>Manufacturer *</Label>
                    <input className="form-control" value={manufacturer} onChange={(e) => { setManufacturer(e.target.value); setErrors(p => ({ ...p, manufacturer: "" })); }} />
                    <p style={{ color: "red", fontSize: '12px' }}>{errors.manufacturer}</p>
                </FormGroup>

                <FormGroup>
                    <Label>Price (OMR) *</Label>
                    <input className="form-control" type="number" value={price} onChange={(e) => { setPrice(e.target.value); setErrors(p => ({ ...p, price: "" })); }} />
                    <p style={{ color: "red", fontSize: '12px' }}>{errors.price}</p>
                </FormGroup>

                <FormGroup>
                    <Label>Stock</Label>
                    <input className="form-control" type="number" value={stock} onChange={(e) => { setStock(e.target.value); setErrors(p => ({ ...p, stock: "" })); }} />
                    <p style={{ color: "red", fontSize: '12px' }}>{errors.stock}</p>
                </FormGroup>

                <FormGroup>
                    <Label>Category</Label>
                    <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>General</option>
                        <option>Vitamins</option>
                        <option>Baby Care</option>
                        <option>First Aid</option>
                        <option>Skin Care</option>
                        <option>Prescription</option>
                    </select>
                </FormGroup>

                <FormGroup>
                    <Label>Image URL</Label>
                    <input className="form-control" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                </FormGroup>

                <FormGroup>
                    <Label>Description</Label>
                    <textarea className="form-control" rows="2" value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormGroup>

                <FormGroup check>
                    <input type="checkbox" id="rx" checked={requiresPrescription} onChange={(e) => setRequiresPrescription(e.target.checked)} />
                    <Label for="rx" check style={{ marginLeft: '8px' }}>Requires Prescription</Label>
                </FormGroup>

                <Button style={{ background: BTN_COLOR, border: 'none', borderRadius: '30px', marginTop: '15px' }} className="form-control" onClick={addProduct}>
                    Add Product
                </Button>
            </Col>

            {/* TABLE */}
            <Col md="7" style={{ marginTop: "20px" }}>
                <h4>Products List ({products.length})</h4>
                <Table bordered hover responsive style={{ background: 'white', borderRadius: '10px' }}>
                    <thead style={{ background: BTN_COLOR, color: 'white' }}>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Manufacturer</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Rx</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ background: "white" }}>
                        {products.map((p, i) => (
                            <tr key={p._id}>
                                <td>{i + 1}</td>
                                <td>{p.name}</td>
                                <td>{p.manufacturer}</td>
                                <td>{p.price} OMR</td>
                                <td>{p.stock}</td>
                                <td>{p.requiresPrescription ? <Badge color="danger">Yes</Badge> : <Badge color="secondary">No</Badge>}</td>
                                <td>
                                    <Button color="warning" size="sm" onClick={() => openEdit(p)}>Edit</Button>{" "}
                                    <Button color="danger" size="sm" onClick={() => deleteProduct(p._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>

        {/* EDIT MODAL */}
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Edit Product</ModalHeader>
            <ModalBody>
                {["name", "manufacturer", "description"].map(field => (
                    <FormGroup key={field}>
                        <Label style={{ textTransform: 'capitalize' }}>{field}</Label>
                        <input className="form-control" value={editData[field] || ""} onChange={(e) => setEditData(p => ({ ...p, [field]: e.target.value }))} />
                        <p style={{ color: "red", fontSize: '12px' }}>{editErrors[field]}</p>
                    </FormGroup>
                ))}
                <FormGroup>
                    <Label>Price (OMR)</Label>
                    <input className="form-control" type="number" value={editData.price || ""} onChange={(e) => setEditData(p => ({ ...p, price: e.target.value }))} />
                    <p style={{ color: "red", fontSize: '12px' }}>{editErrors.price}</p>
                </FormGroup>
                <FormGroup>
                    <Label>Stock</Label>
                    <input className="form-control" type="number" value={editData.stock || ""} onChange={(e) => setEditData(p => ({ ...p, stock: e.target.value }))} />
                </FormGroup>
                <FormGroup>
                    <Label>Image URL</Label>
                    <input className="form-control" value={editData.image || ""} onChange={(e) => setEditData(p => ({ ...p, image: e.target.value }))} />
                </FormGroup>
                <FormGroup check>
                    <input type="checkbox" checked={editData.requiresPrescription || false} onChange={(e) => setEditData(p => ({ ...p, requiresPrescription: e.target.checked }))} />
                    <Label check style={{ marginLeft: '8px' }}>Requires Prescription</Label>
                </FormGroup>
                <Button style={{ background: BTN_COLOR, border: 'none', marginTop: '15px' }} className="form-control" onClick={updateProduct}>
                    Update Product
                </Button>
            </ModalBody>
        </Modal>
    </Container>
);

}

export default AdminProducts;
