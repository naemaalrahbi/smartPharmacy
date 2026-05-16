import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    age: { type: Number },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] }
}, {
    timestamps: true,
    versionKey: false
});

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
