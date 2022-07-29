import { PayloadAction } from "@reduxjs/toolkit"
import { put, select, takeLatest } from 'redux-saga/effects';
import {
    requireEthChainIdMatched,
    requireEthWalletConnected,
    setEthShowSwitchChainIdPopup,
    setEthShowWalletConnectPopup,
    setEthWallet,
} from "../wallet/wallet-slice";
import { walletSelectorEthIsChainIdMatched, walletSelectorEthIsWalletConnected } from "./wallet-selectors";

export default function* walletSaga() {
    // only the take the latest fetch result
    yield takeLatest(setEthWallet().type, handleSetEthWallet)
    yield takeLatest(requireEthWalletConnected().type, handleRequireEthWalletConnected)
    yield takeLatest(requireEthChainIdMatched().type, handleRequireEthChainIdMatched)
}

export function* handleSetEthWallet(action: PayloadAction) {
    const isWalletConnected = yield select(walletSelectorEthIsWalletConnected)
    if (isWalletConnected) {
        yield put(setEthShowWalletConnectPopup(false))
    }
}

export function* handleRequireEthWalletConnected(action: PayloadAction) {
    const isWalletConnected = yield select(walletSelectorEthIsWalletConnected)

    yield put(setEthShowWalletConnectPopup(!isWalletConnected))
}

export function* handleRequireEthChainIdMatched(action: PayloadAction) {
    const isWalletConnected = yield select(walletSelectorEthIsWalletConnected)
console.log('adf');

    if (!isWalletConnected) {
        yield put(setEthShowWalletConnectPopup(true))
    } else {
        const isChainIdMatched = yield select(walletSelectorEthIsChainIdMatched)
        console.log('as');
        
        yield put(setEthShowSwitchChainIdPopup(!isChainIdMatched))
    }
}
