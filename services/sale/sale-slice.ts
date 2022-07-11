import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { GenericAssetDto } from 'nftopia-shared/dist/shared/asset/types';

interface SaleState {
    isLoading: boolean,
    buyModalRequired: boolean,
    buyModalVisible: boolean,
    sellModalRequired: boolean,
    sellModalVisible: boolean,
    asset: GenericAssetDto,
}

export interface BuyPayload {
    caller: string,
    provider: Web3Provider,
    asset: GenericAssetDto,
    price: BigNumber,
    fingerprint?: string
}

export interface SellPayload {
    caller: string,
    provider: Web3Provider,
    asset: GenericAssetDto,
    price: BigNumber,
    expiresAt: number,
}

export interface StopSellingPayload {
    caller: string,
    provider: Web3Provider,
    asset: GenericAssetDto,
}

export const saleInitialState: SaleState = {
    isLoading: false,
    buyModalRequired: false,
    buyModalVisible: false,
    sellModalRequired: false,
    sellModalVisible: false,
    asset: undefined,
};

export const saleSlice = createSlice({
    name: 'sale',
    initialState: saleInitialState,
    reducers: {
        setAssetForSale(state, action: PayloadAction<GenericAssetDto>) {
            state.asset = action.payload
        },

        // buyings
        setBuyModalRequired(state, action: PayloadAction<boolean>) {
            state.buyModalRequired = action.payload
        },
        buyRequest(state, action: PayloadAction<BuyPayload>) {
            state.isLoading = true
        },
        buySuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        buyFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },

        // sellings
        setSellModalRequired(state, action: PayloadAction<boolean>) {
            state.sellModalRequired = action.payload
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
    setAssetForSale,
    setBuyModalRequired,
    buyRequest,
    buySuccess,
    buyFailure,

    setSellModalRequired,
    sellRequest,
    sellSuccess,
    sellFailure,
    stopSellingRequest,
    stopSellingSuccess,
    stopSellingFailure,
} = saleSlice.actions;
const saleReducer = saleSlice.reducer;
export default saleReducer;