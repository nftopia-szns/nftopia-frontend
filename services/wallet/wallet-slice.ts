import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WalletState {
    account: string,
    provider: Web3Provider,
}

export interface SetWalletPayload {
    account: string,
    provider: Web3Provider,
}

const walletInitialState: WalletState = {
    account: undefined,
    provider: undefined,
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: walletInitialState,
    reducers: {
        setWallet(state, action: PayloadAction<SetWalletPayload>) {
            state.account = action.payload.account;
            state.provider = action.payload.provider;
        },
    },
});

export const { setWallet } = walletSlice.actions;
const walletReducer = walletSlice.reducer;
export default walletReducer;