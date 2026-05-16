import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String, default: "General" },
    requiresPrescription: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    expiryDate: { type: Date }
}, {
    timestamps: true,
    versionKey: false
});

const ProductModel = mongoose.model("products", ProductSchema);
export default ProductModel;
