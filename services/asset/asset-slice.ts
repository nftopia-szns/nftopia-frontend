import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types';

export interface AssetBriefInfo {
    index: string
    id: string
}

interface AssetState {
    isLoading: boolean,
    assetDetail: object
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
        setAssetDetail(state, action: PayloadAction<object>) {
            state.assetDetail = action.payload;
        },
        fetchAssetSuccess(state, action: PayloadAction<object>) {
            state.isLoading = false
            state.assetDetail = action.payload;
        },
    },
});

export const { setAssetDetail, fetchAsset, fetchAssetSuccess } = assetSlice.actions;
const assetReducer = assetSlice.reducer;
export default assetReducer;