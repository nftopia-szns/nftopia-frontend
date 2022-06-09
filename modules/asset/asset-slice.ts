import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetaversePlatform } from '../../components/search/SearchBar/SearchBar.types';
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types';

export interface AssetBriefInfo {
    metaversePlatform: MetaversePlatform
    id: string
}

interface AssetState {
    isLoading: boolean,
    assetDetail: DecentralandSearchHitDto | object
}

const assetInitialState: AssetState = {
    isLoading: false,
    assetDetail: null,
};

export const assetSlice = createSlice({
    name: 'asset',
    initialState: assetInitialState,
    reducers: {
        fetchAsset(state, action: PayloadAction<AssetBriefInfo>) {
            state.isLoading = true
        },
        setAssetDetail(state, action: PayloadAction<DecentralandSearchHitDto>) {
            state.assetDetail = action.payload;
        },
        fetchAssetSuccess(state, action: PayloadAction<DecentralandSearchHitDto>) {
            state.isLoading = false
            state.assetDetail = action.payload;
        },
    },
});

export const { setAssetDetail, fetchAsset, fetchAssetSuccess } = assetSlice.actions;
const assetReducer = assetSlice.reducer;
export default assetReducer;