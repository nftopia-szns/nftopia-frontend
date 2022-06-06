import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DecentralandSearchHitDto } from '../../components/search/search.types';

interface AssetState {
    isLoading: boolean,
}

export interface BidPayload {
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
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
        bidRequest(state, action: PayloadAction<BidPayload>) {
            state.isLoading = true
        },
        bidSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        bidFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false

        }
    },
});

export const { bidRequest, bidSuccess, bidFailure } = bidSlice.actions;
const bidReducer = bidSlice.reducer;
export default bidReducer;