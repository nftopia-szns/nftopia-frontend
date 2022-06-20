import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types';

interface SaleState {
    isLoading: boolean,
}

export interface BuyPayload {
    caller: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
    price: BigNumber,
    fingerprint?: string
}

export interface SellPayload {
    caller: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
    price: BigNumber,
    expiresAt: number,
}

export interface StopSellingPayload {
    caller: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
}

export const saleInitialState: SaleState = {
    isLoading: false,
};

export const saleSlice = createSlice({
    name: 'sale',
    initialState: saleInitialState,
    reducers: {
        buyRequest(state, action: PayloadAction<BuyPayload>) {
            state.isLoading = true
        },
        buySuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        buyFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        sellRequest(state, action: PayloadAction<SellPayload>) {
            state.isLoading = true
        },
        sellSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        sellFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        stopSellingRequest(state, action: PayloadAction<StopSellingPayload>) {
            state.isLoading = true
        },
        stopSellingSuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        stopSellingFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
    },
});

export const {
    buyRequest,
    buySuccess,
    buyFailure,
    sellRequest,
    sellSuccess,
    sellFailure,
    stopSellingRequest,
    stopSellingSuccess,
    stopSellingFailure,
} = saleSlice.actions;
const saleReducer = saleSlice.reducer;
export default saleReducer;