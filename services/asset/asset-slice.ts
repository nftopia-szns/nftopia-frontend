import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform"

export interface AssetBriefInfo {
    platform: MetaversePlatform
    index: string
    id: string
}

interface AssetState {
    isLoading: boolean,
    platform: MetaversePlatform,
    assetDetail: object,
    nearbyAssets: object[],
}

const assetInitialState: AssetState = {
    isLoading: false,
    platform: null,
    assetDetail: null,
    nearbyAssets: null,
};

export const assetSlice = createSlice({
    name: 'asset',
    initialState: assetInitialState,
    reducers: {
        fetchAsset(state, action: PayloadAction<AssetBriefInfo>) {
            state.isLoading = true
            state.platform = action.payload.platform
        },
        setAssetDetail(state, action: PayloadAction<object>) {
            state.assetDetail = action.payload;
        },
        fetchNearbyAssets(state, action: PayloadAction) {
        },
        setNearbyAssets(state, action: PayloadAction<object[]>) {
            state.nearbyAssets = action.payload
        },
        fetchAssetSuccess(state, action: PayloadAction<object>) {
            state.isLoading = false
            state.assetDetail = action.payload;
        },
    },
});

export const {
    fetchAsset,
    setAssetDetail,
    fetchAssetSuccess,
    fetchNearbyAssets,
    setNearbyAssets,
} = assetSlice.actions;
const assetReducer = assetSlice.reducer;
export default assetReducer;