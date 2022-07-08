import { PayloadAction } from "@reduxjs/toolkit"
import { put, select, takeLatest } from 'redux-saga/effects';
import {
    requireEthChainIdMatched,
    requireEthWalletConnected,
    setEthShowSwitchChainIdPopup,
    setEthShowWalletConnectPopup,
} from "../wallet/wallet-slice";
import { walletSelectorEthIsChainIdMatched, walletSelectorEthIsWalletConnected } from "./wallet-selectors";

export function* handleRequireEthChainIdMatched(action: PayloadAction) {
    const isWalletConnected = yield select(walletSelectorEthIsWalletConnected)
    console.log(isWalletConnected);

    yield put(setEthShowWalletConnectPopup(!isWalletConnected))
}

export function* handleRequireEthWalletConnected(action: PayloadAction) {
    const isChainIdMatched = yield select(walletSelectorEthIsChainIdMatched)
    console.log(isChainIdMatched);
    
    yield put(setEthShowSwitchChainIdPopup(!isChainIdMatched))
}

export default function* walletSaga() {
    // only the take the latest fetch result
    yield takeLatest(requireEthChainIdMatched().type, handleRequireEthChainIdMatched)
    yield takeLatest(requireEthWalletConnected().type, handleRequireEthWalletConnected)
}
