import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NFT } from '../../../components/asset/DecentralandAsset/DecentralandAsset.type';

interface AssetState {
    isLoading: boolean,
}

export interface BidPayload {
    nft: NFT,
    price: number,
    expiresAt: number,
    fingerprint?: string
}

export const assetInitialState: AssetState = {
    isLoading: false,
};

export const bidSlice = createSlice({
    name: 'bid',
    initialState: assetInitialState,
    reducers: {
        onPlaceBid(state, action: PayloadAction<BidPayload>) {
            state.isLoading = true
        },
        onBidSentSuccess(state, action: PayloadAction<{}>) {

        },
        onBidSentFail(state, action: PayloadAction<{}>) {

        }
    },
});

export const { onPlaceBid, onBidSentSuccess, onBidSentFail } = bidSlice.actions;
const bidReducer = bidSlice.reducer;
export default bidReducer;