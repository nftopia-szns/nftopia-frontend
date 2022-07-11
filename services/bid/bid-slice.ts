import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';

interface BidState {
    isLoading: boolean,
    bidModalRequired: boolean,
    bidModalVisible: boolean,
    asset: GenericAssetDto,
}

export interface BidPayload {
    caller: string,
    provider: Web3Provider,
    asset: GenericAssetDto,
    price: BigNumber,
    duration: number,
    fingerprint?: string
}
export interface AcceptBidPayload {
    sender: string,
    recipient: string,
    provider: Web3Provider,
    asset: GenericAssetDto,
}
export interface CancelBidPayload {
    provider: Web3Provider,
    asset: GenericAssetDto,
}

const bidInitialState: BidState = {
    isLoading: false,
    bidModalRequired: false,
    bidModalVisible: false,
    asset: undefined,
};

export const bidSlice = createSlice({
    name: 'bid',
    initialState: bidInitialState,
    reducers: {
        setAssetForBid(state, action: PayloadAction<GenericAssetDto>) {
            state.asset = action.payload
        },
        setBidModalRequired(state, action: PayloadAction<boolean>) {
            state.bidModalRequired = action.payload
        },
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
    setBidModalRequired,
    setAssetForBid,
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