import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import UserModel from "./models/UserModel.js";
import ProductModel from "./models/ProductModel.js";
import CartModel from "./models/CartModel.js";
import OrderModel from "./models/OrderModel.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("✅ DB Connected - Smart Pharmacy");
}).catch((err) => {
    console.log("❌ DB Error:", err.message);
});

// =============================
//       USER ROUTES
// =============================

// Register
app.post("/register", async (req, res) => {
    try {
        const { username, email, phone, age, password } = req.body;

        if (!username || !email || !phone || !age || !password)
            return res.json({ message: "All fields are required" });

        const exist = await UserModel.findOne({ email });
        if (exist) return res.json({ message: "Email already exists" });

        // Business Logic: age must be 12 or older
        if (Number(age) < 12)
            return res.json({ message: "Age must be 12 or older to register" });

        // Business Logic: password strength
        if (password.length < 6)
            return res.json({ message: "Password must be at least 6 characters" });

        const hash = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ username, email, phone, age, password: hash });

        res.json({ message: "Registered", user });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// Login (User)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const check = await UserModel.findOne({ email, role: "user" });
        if (!check) return res.json({ message: "User not found" });

        const match = await bcrypt.compare(password, check.password);
        if (!match) return res.json({ message: "Incorrect password" });

        res.json({ message: "Success", user: check });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// Login (Admin)
app.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const check = await UserModel.findOne({ email, role: "admin" });
        if (!check) return res.json({ message: "Admin not found" });

        const match = await bcrypt.compare(password, check.password);
        if (!match) return res.json({ message: "Incorrect password" });

        res.json({ message: "Success", user: check });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// Forgot Password (simulate)
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.json({ message: "Email not found" });
        // In production: send email with reset link
        res.json({ message: "Reset link sent to your email" });
    } catch (err) {
        res.json({ message: "Server error" });
    }
});


// Reset Password
app.post("/reset-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.json({ message: "Email not found" });

        if (!newPassword || newPassword.length < 8)
            return res.json({ message: "Password must be at least 8 characters" });

        const hash = await bcrypt.hash(newPassword, 10);
        await UserModel.findOneAndUpdate({ email }, { password: hash });

        res.json({ message: "Password updated" });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// =============================
//       PRODUCT ROUTES
// =============================

// Add Product (Admin)
app.post("/product/add", async (req, res) => {
    try {
        const { name, manufacturer, price, image, description, category, requiresPrescription, stock, expiryDate } = req.body;

        // Business Logic: validate price
        if (!name || !manufacturer || !price)
            return res.json({ message: "Name, manufacturer and price are required" });

        if (Number(price) <= 0)
            return res.json({ message: "Price must be greater than 0" });

        if (stock !== undefined && Number(stock) < 0)
            return res.json({ message: "Stock cannot be negative" });

        await ProductModel.create({ name, manufacturer, price, image, description, category, requiresPrescription, stock, expiryDate });
        res.json({ message: "Product Added" });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// Get All Products
app.get("/products", async (req, res) => {
    const data = await ProductModel.find();
    res.json(data);
});

// Search Products
app.get("/products/search/:key", async (req, res) => {
    const data = await ProductModel.find({
        name: { $regex: req.params.key, $options: "i" }
    });
    res.json(data);
});

// Delete Product
app.delete("/product/delete/:id", async (req, res) => {
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Update Product
app.put("/product/update/:id", async (req, res) => {
    try {
        const { price, stock } = req.body;

        // Business Logic validations on update
        if (price !== undefined && Number(price) <= 0)
            return res.json({ message: "Price must be greater than 0" });

        if (stock !== undefined && Number(stock) < 0)
            return res.json({ message: "Stock cannot be negative" });

        await ProductModel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Updated" });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// =============================
//        CART ROUTES
// =============================

// Add to cart
app.post("/cart/add", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Business Logic: check stock
        const product = await ProductModel.findById(productId);
        if (!product) return res.json({ message: "Product not found" });
        if (product.stock < quantity)
            return res.json({ message: "Insufficient stock" });

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            cart = await CartModel.create({ userId, items: [{ productId, quantity }] });
        } else {
            const index = cart.items.findIndex(i => i.productId == productId);
            if (index >= 0) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        }

        res.json({ message: "Added", cart });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// Clear cart
app.delete("/cart/removeall/:userId", async (req, res) => {
    await CartModel.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
});

// Get cart
app.get("/cart/:userId", async (req, res) => {
    const cart = await CartModel.findOne({ userId: req.params.userId })
        .populate("items.productId");
    res.json(cart);
});

// Update quantity
app.post("/cart/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (quantity <= 0) return res.json({ message: "Quantity must be at least 1" });

        const cart = await CartModel.findOne({ userId });
        const index = cart.items.findIndex(i => i.productId == productId);
        cart.items[index].quantity = quantity;
        await cart.save();

        res.json({ message: "Updated" });
    } catch (err) {
        res.json({ message: "Server error" });
    }
});

// Remove item
app.delete("/cart/remove/:userId/:productId", async (req, res) => {
    const { userId, productId } = req.params;
    const cart = await CartModel.findOne({ userId });
    cart.items = cart.items.filter(i => i.productId != productId);
    await cart.save();
    res.json({ message: "Removed" });
});

// =============================
//        ORDER ROUTES
// =============================

// Create Order
app.post("/order/create", async (req, res) => {
    try {
        const { userId, items, total, paymentMethod, fullname, phone, address, city, notes, deliveryLocation } = req.body;

        // Business Logic: validate total
        if (!items || items.length === 0)
            return res.json({ message: "Order must have at least one item" });

        const order = await OrderModel.create({
            userId, items, total, paymentMethod,
            fullname, phone, address, city, notes,
            deliveryLocation,
            orderStatus: "on_the_way",
            paymentStatus: "paid"
        });

        res.json({ message: "Order Placed", order });
    } catch (err) {
        res.json({ message: "Server error: " + err.message });
    }
});

// User Orders
app.get("/orders/:userId", async (req, res) => {
    const data = await OrderModel.find({ userId: req.params.userId })
        .populate("items.productId");
    res.json(data);
});

// Order Details
app.get("/order/details/:id", async (req, res) => {
    const data = await OrderModel.findById(req.params.id).populate("items.productId");
    res.json(data);
});

// Cancel Order
app.post("/order/cancel/:id", async (req, res) => {
    await OrderModel.findByIdAndUpdate(req.params.id, { orderStatus: "cancelled" });
    res.json({ message: "Cancelled" });
});

// =============================
//         SERVER START
// =============================
app.listen(PORT, () => {
    console.log(`🚀 Smart Pharmacy Server running on port ${PORT}`);
});
