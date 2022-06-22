import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DecentralandCategoryFilter, DecentralandSaleFilter, DecentralandSortByCriterias, MetaversePlatform } from '../../components/search/search.types';
import { EmptySearchResultDto, SearchDto, SearchHitBase, SearchResultDto } from '../../pages/api/search/search.types';
import { QueryBuilder } from '../../pages/api/search/search.utils';
import { buildSearchDtoFromState } from './search.utils';

export interface DecentralandSearchState {
    // sorts
    sortBy: DecentralandSortByCriterias

    // filters
    categoryFilter: DecentralandCategoryFilter[]; // estate, parcel
    saleFilter: DecentralandSaleFilter; // on sale, not on sale, expired...
    priceMinFilter?: number;
    priceMaxFilter?: number;
    ownerFilter?: string;
}

export interface SearchState {
    isLoading: boolean;

    /**
     * Specifies this field to search in name, description, owner...
     */
    query: string;
    page: number;
    pageSize: number;
    platform: MetaversePlatform;
    platformSearchState: DecentralandSearchState;

    searchResult: SearchResultDto<SearchHitBase>;
}

export const searchInitialState: SearchState = {
    isLoading: false,

    query: '',
    page: 1,
    pageSize: 10,
    platform: MetaversePlatform.Decentraland,
    platformSearchState: {
        categoryFilter: [DecentralandCategoryFilter.Estate, DecentralandCategoryFilter.Parcel],
        saleFilter: DecentralandSaleFilter.All,
        sortBy: DecentralandSortByCriterias.Price,
    },

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
        rPlatform(state, action: PayloadAction<MetaversePlatform>) {
            state.platform = action.payload;
        },
        rDecentralandSearchState(state, action: PayloadAction<DecentralandSearchState>) {
            state.platformSearchState = action.payload;
        },
        // rCategoryFilter(state, action: PayloadAction<DecentralandCategoryFilter[]>) {
        //     state.categoryFilter = action.payload
        // },
        // rSaleFilter(state, action: PayloadAction<DecentralandSaleFilter>) {
        //     state.saleFilter = action.payload;
        // },
        // rPriceMinFilter(state, action: PayloadAction<number>) {
        //     state.priceMinFilter = action.payload;
        // },
        // rPriceMaxFilter(state, action: PayloadAction<number>) {
        //     state.priceMaxFilter = action.payload;
        // },
        // rOwnerFilter(state, action: PayloadAction<string>) {
        //     state.ownerFilter = action.payload;
        // },
        // rSortBy(state, action: PayloadAction<DecentralandSortByCriterias>) {
        //     state.sortBy = action.payload;
        // },
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
    rPlatform,
    rDecentralandSearchState,

    searchSuccess,
    searchStart,

} = searchSlice.actions;
const searchReducer = searchSlice.reducer;
export default searchReducer;