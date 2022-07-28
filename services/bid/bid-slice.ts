import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { Bid } from 'nftopia-shared/dist/shared';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';

interface BidState {
    isLoading: boolean,
    bidModalRequired: boolean,
    bidModalVisible: boolean,
    asset: GenericAssetDto,
}

export interface CreateBidPayload {
    quoteToken: string,
    price: BigNumber,
    fingerprint?: string
}

export interface AcceptBidPayload {
    bid: Bid,
}

export interface CancelBidPayload {
    bid: Bid,
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
        createBid(state, action: PayloadAction<CreateBidPayload>) {
            state.isLoading = true
        },
        cancelBid(state, action: PayloadAction<CancelBidPayload>) {
            state.isLoading = true
        },
        acceptBid(state, action: PayloadAction<AcceptBidPayload>) {
            state.isLoading = true
        },
    },
});

export const {
    setBidModalRequired,
    setAssetForBid,
    createBid,
    cancelBid,
    acceptBid,
} = bidSlice.actions;
const bidReducer = bidSlice.reducer;
export default bidReducer;