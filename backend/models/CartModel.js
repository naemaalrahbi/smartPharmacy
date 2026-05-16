import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

const CartModel = mongoose.model("cart", CartSchema);
export default CartModel;
