import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EthereumBasedWallet } from './wallet.types';

export interface WalletState {
    // this could be applied for ETH, BSC, Polygon... or EVM-like in general
    ethWallet: EthereumBasedWallet

    // app demand
    ethRequiredChainId: number,

    ethShowWalletConnectPopup: boolean,
    ethShowSwitchChainIdPopup: boolean,
}

const walletInitialState: WalletState = {
    ethWallet: {
        account: undefined,
        provider: undefined,
        chainId: undefined,
    },

    // eth state
    ethRequiredChainId: undefined,

    // eth popups
    ethShowWalletConnectPopup: false,
    ethShowSwitchChainIdPopup: false,
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: walletInitialState,
    reducers: {
        setEthWallet(state, action: PayloadAction<EthereumBasedWallet>) {
            state.ethWallet = action.payload;
        },
        setEthRequiredChainId(state, action: PayloadAction<number>) {
            state.ethRequiredChainId = action.payload;
        },
        setEthShowWalletConnectPopup(state, action: PayloadAction<boolean>) {
            state.ethShowWalletConnectPopup = action.payload;
        },
        setEthShowSwitchChainIdPopup(state, action: PayloadAction<boolean>) {
            state.ethShowSwitchChainIdPopup = action.payload;
        },
        // saga actions
        requireEthWalletConnected(state, action: PayloadAction) {
        },
        requireEthChainIdMatched(state, action: PayloadAction) {
        },
    },
});

export const {
    setEthWallet,
    setEthRequiredChainId,
    setEthShowWalletConnectPopup,
    setEthShowSwitchChainIdPopup,
    requireEthWalletConnected,
    requireEthChainIdMatched,
} = walletSlice.actions;
const walletReducer = walletSlice.reducer;
export default walletReducer;