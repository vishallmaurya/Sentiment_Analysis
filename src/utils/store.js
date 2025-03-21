import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getBackendURL } from "./EnvLoader";

const sentimentSlice = createSlice({
    name: "sentiment",
    initialState: { sentimentScore: 1 },
    reducers: {
        setSentiment: (state, action) => {
            state.sentimentScore = action.payload;
        }
    }
});


const getUser = async () => {
    try {
        const response = await axios.post(getBackendURL() + "/users/current-user", {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return null;
    }
}

const userSlice = createSlice({
    name: "user",
    initialState: { user: await getUser() },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { setSentiment } = sentimentSlice.actions;
export const { setUser } = userSlice.actions;

const store = configureStore({
    reducer: {
        sentiment: sentimentSlice.reducer,
        user: userSlice.reducer
    }
});

export default store;