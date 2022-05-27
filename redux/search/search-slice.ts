import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    query: string;
    page: number;
    hits: object; // TODO: 
}

const initialState: SearchState = {
    query: '',
    page: 1,
    hits: null, // TODO:
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        queryChange(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        pageChange(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
    },
});

export const { queryChange, pageChange } = searchSlice.actions;
const searchReducer = searchSlice.reducer;
export default searchReducer;