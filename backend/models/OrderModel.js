import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
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
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    paymentMethod: { type: String, default: "cash" },
    paymentStatus: { type: String, default: "paid" },
    orderStatus: { type: String, default: "on_the_way" },
    deliveryTime: String,
    fullname: String,
    phone: String,
    address: String,
    city: String,
    notes: String,
    deliveryLocation: {
        lat: Number,
        lng: Number,
        address: String
    }
}, {
    timestamps: true,
    versionKey: false
});

const OrderModel = mongoose.model("orders", OrderSchema);
export default OrderModel;
