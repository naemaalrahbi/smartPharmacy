import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk("orders/create", async (data) => {
    const res = await axios.post("http://localhost:5001/order/create", data);
    return res.data;
});

export const getOrders = createAsyncThunk("orders/getAll", async (userId) => {
    const res = await axios.get(`http://localhost:5001/orders/${userId}`);
    return res.data;
});

const initVal = {
    orders: [],
    isLoading: false,
    isError: false
};

export const OrderSlice = createSlice({
    name: "orders",
    initialState: initVal,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => { state.isLoading = true; })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload || [];
            })
            .addCase(getOrders.rejected, (state) => { state.isLoading = false; state.isError = true; });
    }
});

export default OrderSlice.reducer;
