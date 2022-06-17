import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryFilter, SaleFilter, SortByCriterias } from '../../components/search/search.types';
import { EmptySearchResultDto, SearchDto, SearchHitBase, SearchResultDto } from '../../pages/api/search/search.types';
import { QueryBuilder } from '../../pages/api/search/search.utils';
import { buildSearchDtoFromState } from './search.utils';

export interface SearchState {
    isLoading: boolean;
    /**
     * This field is built incrementally over search state changes.
     * Whenever a user issues a `searchStart` action, this field is used to as search payload.
     */
    searchDto: SearchDto

    /**
     * Specifies the Elasticsearch indices to search.
     */
    indices: string[];
    /**
     * Specifies this field to search in name, description, owner...
     */
    query: string;
    page: number;
    pageSize: number;

    // filters
    categoryFilter: CategoryFilter[]; // estate, parcel
    saleFilter: SaleFilter; // on sale, not on sale, expired...
    priceMinFilter?: number;
    priceMaxFilter?: number;

    // sorts
    sortBy?: SortByCriterias
    searchResult: SearchResultDto<SearchHitBase>;
}

export const searchInitialState: SearchState = {
    isLoading: false,
    searchDto: {
        // TODO: remove this hardcode
        indices: ['decentraland-ethereum-3'],
        query: undefined,
        page: 1,
        pageSize: 10,
    },
    // TODO: remove this hardcode
    indices: ['decentraland-ethereum-3'],

    query: '',
    page: 1,
    pageSize: 10,
    
    categoryFilter: Object.values(CategoryFilter),
    saleFilter: SaleFilter.All,
    
    searchResult: EmptySearchResultDto,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState: searchInitialState,
    reducers: {
        rQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        rPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        rPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
        rCategoryFilter(state, action: PayloadAction<CategoryFilter[]>) {
            state.categoryFilter = action.payload
        },
        rSaleFilter(state, action: PayloadAction<SaleFilter>) {
            state.saleFilter = action.payload;
        },
        rPriceMinFilter(state, action: PayloadAction<number>) {
            state.priceMinFilter = action.payload;
        },
        rPriceMaxFilter(state, action: PayloadAction<number>) {
            state.priceMaxFilter = action.payload;
        },
        rSortBy(state, action: PayloadAction<SortByCriterias>) {
            state.sortBy = action.payload;
        },
        searchStart(state, action: PayloadAction<SearchDto>) {
            state.isLoading = true
        },
        searchSuccess(state, action: PayloadAction<SearchResultDto<SearchHitBase>>) {
            state.isLoading = false
            state.searchResult = action.payload
        },
    },
});

export const {
    rQuery,
    rPage,
    rPageSize,

    rCategoryFilter,
    rSaleFilter,
    rPriceMinFilter,
    rPriceMaxFilter,

    rSortBy,

    searchSuccess,
    searchStart,

} = searchSlice.actions;
const searchReducer = searchSlice.reducer;
export default searchReducer;