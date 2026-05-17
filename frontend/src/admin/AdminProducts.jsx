const loadProducts = async () => {
    const res = await axios.get(
        "https://smartpharmacy-lysm.onrender.com/products"
    );
    setProducts(res.data);
};

const addProduct = async () => {
    if (!validateAdd()) return;

    const res = await axios.post(
        "https://smartpharmacy-lysm.onrender.com/product/add",
        {
            name,
            manufacturer,
            price: Number(price),
            image,
            category,
            stock: Number(stock) || 0,
            requiresPrescription,
            description
        }
    );

    setServerMsg(res.data.message);

    if (res.data.message === "Product Added") {
        setName("");
        setManufacturer("");
        setPrice("");
        setImage("");
        setCategory("General");
        setStock("");
        setRequiresPrescription(false);
        setDescription("");
        setErrors({});
        loadProducts();
    }
};

const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
        await axios.delete(
            `https://smartpharmacy-lysm.onrender.com/product/delete/${id}`
        );
        loadProducts();
    }
};

const updateProduct = async () => {
    if (!validateEdit()) return;

    const res = await axios.put(
        `https://smartpharmacy-lysm.onrender.com/product/update/${editId}`,
        editData
    );

    if (res.data.message === "Updated") {
        toggle();
        loadProducts();
    } else {
        alert(res.data.message);
    }
};
