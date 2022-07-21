import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';
import { MetaversePlatform } from 'nftopia-shared/dist/shared/platform';
import {
    EmptySearchResultDto,
    SearchDto,
    SearchResultDto
} from '../../pages/api/search/search.types';
import {
    CryptovoxelsSearchState,
    DecentralandCategoryFilterOptions,
    DecentralandSaleFilter,
    DecentralandSearchState,
    DecentralandSortByCriterias,
    InitialCryptovoxelsSearchState,
    InitialDecentralandSearchState,
    InitialSandBoxSearchState,
    InitialSolanaTownSearchState,
    SandBoxSearchState,
    SolanaTownSearchState
} from './search.types';

export type PlatformSearchState =
    DecentralandSearchState |
    SandBoxSearchState |
    CryptovoxelsSearchState |
    SolanaTownSearchState;

export interface SearchState {
    isLoading: boolean;

    /**
     * Specifies this field to search in name, description, owner...
     */
    query: string;
    page: number;
    pageSize: number;
    platform: MetaversePlatform;
    platformSearchState: PlatformSearchState;

    searchResult: SearchResultDto<GenericAssetDto>;
}

export const searchInitialState: SearchState = {
    isLoading: false,

    query: '',
    page: 1,
    pageSize: 10,
    platform: MetaversePlatform.Decentraland,
    platformSearchState: {
        categoryFilter: DecentralandCategoryFilterOptions,
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
            switch (state.platform) {
                case MetaversePlatform.Decentraland:
                    state.platformSearchState = InitialDecentralandSearchState
                    break;
                case MetaversePlatform.SandBox:
                    state.platformSearchState = InitialSandBoxSearchState
                    break;
                case MetaversePlatform.Cryptovoxels:
                    state.platformSearchState = InitialCryptovoxelsSearchState
                    break;
                case MetaversePlatform.SolanaTown:
                    state.platformSearchState = InitialSolanaTownSearchState
                    break;
                default:
                    state.platformSearchState = InitialDecentralandSearchState
                    break;
            }
        },
        rPlatformSearchState(state,
            action: PayloadAction<PlatformSearchState>) {
            state.platformSearchState = action.payload;
        },
        searchStart(state, action: PayloadAction<SearchDto>) {
            state.isLoading = true
        },
        searchSuccess(state, action: PayloadAction<SearchResultDto<GenericAssetDto>>) {
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
    rPlatformSearchState,

    searchSuccess,
    searchStart,

} = searchSlice.actions;
const searchReducer = searchSlice.reducer;
export default searchReducer;