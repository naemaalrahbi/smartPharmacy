import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
})();

export const getUser = createAsyncThunk("users/getUser", async (udata) => {
    try {
        const response = await axios.post("http://localhost:5001/login", udata);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const getAdmin = createAsyncThunk("users/getAdmin", async (udata) => {
    try {
        const response = await axios.post("http://localhost:5001/admin/login", udata);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const addUser = createAsyncThunk("user/addUser", async (data) => {
    const response = await axios.post("http://localhost:5001/register", data);
    return response.data;
});

const initVal = {
    user: savedUser || {},
    message: "",
    isLoading: false,
    isSuccess: false,
    isError: false
};

export const UserSlice = createSlice({
    name: "users",
    initialState: initVal,
    reducers: {
        logout: (state) => {
            state.user = {};
            state.message = "";
            localStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.pending, (state) => { state.isLoading = true; })
            .addCase(addUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
            })
            .addCase(addUser.rejected, (state) => { state.isLoading = false; state.isError = true; })

            .addCase(getUser.pending, (state) => { state.isLoading = true; })
            .addCase(getUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
                if (action.payload?.message === "Success") {
                    state.user = action.payload.user;
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                }
            })
            .addCase(getUser.rejected, (state) => { state.isLoading = false; state.isError = true; })

            .addCase(getAdmin.pending, (state) => { state.isLoading = true; })
            .addCase(getAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload?.message;
                if (action.payload?.message === "Success") {
                    state.user = action.payload.user;
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                }
            })
            .addCase(getAdmin.rejected, (state) => { state.isLoading = false; state.isError = true; });
    }
});

export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
