import { configureStore, createSlice } from "@reduxjs/toolkit";

const sentimentSlice = createSlice({
    name: "sentiment",
    initialState: { sentimentScore: 1 },
    reducers: {
        setSentiment: (state, action) => {
            state.sentimentScore = action.payload;
        }
    }
});

export const { setSentiment } = sentimentSlice.actions;

const store = configureStore({
    reducer: {
        sentiment: sentimentSlice.reducer
    }
});

export default store;