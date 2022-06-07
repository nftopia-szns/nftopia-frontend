import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmptySearchResultDto, SearchDto, SearchHitBase, SearchResultDto } from '../../pages/api/search/search.types';

interface SearchState {
    isLoading: boolean;
    query: string;
    page: number;
    pageSize: number;
    searchResult: SearchResultDto<SearchHitBase>;
}

export const searchInitialState: SearchState = {
    isLoading: false,
    query: '',
    page: 1,
    pageSize: 10,
    searchResult: EmptySearchResultDto,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState: searchInitialState,
    reducers: {
        queryChange(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        pageChange(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        pageSizeChange(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
        searchStart(state, action: PayloadAction<SearchDto>) {
            state.isLoading = true
        },
        searchSuccess(state, action: PayloadAction<SearchResultDto<SearchHitBase>>) {
            state.isLoading = false
            state.searchResult = action.payload
            console.log(action.payload);
        },
    },
});

export const { queryChange, pageChange, pageSizeChange, searchSuccess, searchStart } = searchSlice.actions;
const searchReducer = searchSlice.reducer;
export default searchReducer;