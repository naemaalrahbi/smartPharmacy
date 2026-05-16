import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import ProductSlice from "./ProductSlice";
import CartSlice from "./CartSlice";
import OrderSlice from "./OrderSlice";

export default configureStore({
    reducer: {
        users: UserSlice,
        products: ProductSlice,
        cart: CartSlice,
        orders: OrderSlice
    }
});
