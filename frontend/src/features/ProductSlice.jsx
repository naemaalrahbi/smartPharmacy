import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk("products/getProducts", async () => {
    try {
        const response = await axios.get("https://smartpharmacy-lysm.onrender.com/products");
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

const initVal = {
    products: [],
    isLoading: false,
    isSuccess: false,
    isError: false
};

export const ProductSlice = createSlice({
    name: "products",
    initialState: initVal,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.products = action.payload || [];
        });
        builder.addCase(getProducts.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        });
    }
});

export default ProductSlice.reducer;
