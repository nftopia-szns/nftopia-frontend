import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types';

interface BidState {
    isLoading: boolean,
}

export interface BidPayload {
    caller: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
    price: BigNumber,
    duration: number,
    fingerprint?: string
}
export interface AcceptBidPayload {
    sender: string,
    recipient: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
}
export interface CancelBidPayload {
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
}
const bidInitialState: BidState = {
    isLoading: false,
};

export const bidSlice = createSlice({
    name: 'bid',
    initialState: bidInitialState,
    reducers: {
        bidRequest(state, action: PayloadAction<BidPayload>) {
            state.isLoading = true
        },
        bidSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        bidFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        cancelBidRequest(state, action: PayloadAction<CancelBidPayload>) {
            state.isLoading = true
        },
        cancelBidSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        cancelBidFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        acceptBidRequest(state, action: PayloadAction<AcceptBidPayload>) {
            state.isLoading = true
        },
        acceptBidSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        acceptBidFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
    },
});

export const {
    bidRequest,
    bidSuccess,
    bidFailure,
    cancelBidRequest,
    cancelBidSuccess,
    cancelBidFailure,
    acceptBidRequest,
    acceptBidSuccess,
    acceptBidFailure,
} = bidSlice.actions;
const bidReducer = bidSlice.reducer;
export default bidReducer;