import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NFT } from '../../../components/asset/DecentralandAsset/DecentralandAsset.type';

interface AssetState {
    isLoading: boolean,
    contractAddress: string,
    tokenId: string,
    assetDetail: AssetDetail | object
}

export interface AssetDetail {
    data: {
        nft: NFT
    }[],
    order: object
}

export const assetInitialState: AssetState = {
    isLoading: false,
    contractAddress: '',
    tokenId: '',
    assetDetail: null,
};

export const assetSlice = createSlice({
    name: 'search',
    initialState: assetInitialState,
    reducers: {
        fetchStart(state, action: PayloadAction<{ contractAddress: string, tokenId: string }>) {
            state.isLoading = true;
        },
        fetchSuccess(state, action: PayloadAction<AssetDetail>) {
            state.isLoading = false
            state.assetDetail = action.payload
            console.log(action.payload);
        },
    },
});

export const { fetchStart, fetchSuccess } = assetSlice.actions;
const assetReducer = assetSlice.reducer;
export default assetReducer;