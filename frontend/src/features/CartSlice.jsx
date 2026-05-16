import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk("cart/addToCart", async (data) => {
    try {
        const res = await axios.post("https://smartpharmacy-lysm.onrender.com/cart/add", data);
        return res.data;
    } catch (err) {
        console.log(err);
    }
});

export const getCart = createAsyncThunk("cart/getCart", async (userId) => {
    try {
        const res = await axios.get(`http://localhost:5001/cart/${userId}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
});

const initVal = {
    cart: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

export const CartSlice = createSlice({
    name: "cart",
    initialState: initVal,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => { state.isLoading = true; })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
                state.cart = action.payload?.cart;
            })
            .addCase(addToCart.rejected, (state) => { state.isLoading = false; state.isError = true; })
            .addCase(getCart.pending, (state) => { state.isLoading = true; })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload;
            })
            .addCase(getCart.rejected, (state) => { state.isLoading = false; state.isError = true; });
    }
});

export default CartSlice.reducer;
