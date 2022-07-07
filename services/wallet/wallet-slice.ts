import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EthereumBasedWallet } from './wallet.types';

export interface WalletState {
    // this could be applied for ETH, BSC, Polygon... or EVM-like in general
    ethWallet: EthereumBasedWallet

    // app demand
    ethRequiredWalletConnect: boolean,
    ethRequiredChainId: number,
}

const walletInitialState: WalletState = {
    ethWallet: {
        account: undefined,
        provider: undefined,
        chainId: undefined,
    },

    // app demand
    ethRequiredWalletConnect: false,
    ethRequiredChainId: undefined,
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: walletInitialState,
    reducers: {
        setEthWallet(state, action: PayloadAction<EthereumBasedWallet>) {
            state.ethWallet = action.payload;
        },
        setEthRequiredWalletConnect(state, action: PayloadAction<boolean>) {
            state.ethRequiredWalletConnect = action.payload
        },
        setEthRequireChainId(state, action: PayloadAction<number>) {
            state.ethRequiredChainId = action.payload;
        },
    },
});

export const {
    setEthWallet,
    setEthRequiredWalletConnect,
    setEthRequireChainId,
} = walletSlice.actions;
const walletReducer = walletSlice.reducer;
export default walletReducer;