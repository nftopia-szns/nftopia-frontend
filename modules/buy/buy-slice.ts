import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { DecentralandSearchHitDto } from '../../pages/api/search/search.types';

interface AssetState {
    isLoading: boolean,
}

export interface BuyPayload {
    caller: string,
    provider: Web3Provider,
    asset: DecentralandSearchHitDto,
    price: BigNumber,
    fingerprint?: string
}

export const assetInitialState: AssetState = {
    isLoading: false,
};

export const buySlice = createSlice({
    name: 'buy',
    initialState: assetInitialState,
    reducers: {
        buyRequest(state, action: PayloadAction<BuyPayload>) {
            state.isLoading = true
        },
        buySuccess(state, action: PayloadAction<{}>) {
            state.isLoading = false
        },
        buyFailure(state, action: PayloadAction<{}>) {
            state.isLoading = false

        }
    },
});

export const { buyRequest, buySuccess, buyFailure } = buySlice.actions;
const buyReducer = buySlice.reducer;
export default buyReducer;