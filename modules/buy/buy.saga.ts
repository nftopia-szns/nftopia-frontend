import { PayloadAction } from "@reduxjs/toolkit"
import { select, takeEvery, takeLatest } from 'redux-saga/effects';
import { WalletState } from "../wallet/wallet-slice";
import { BuyPayload, buyRequest } from "./buy-slice";
import { BuyService } from "./buy.service";

export function* handleBuyRequest(action: PayloadAction<BuyPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)
        
        try {
            const buyService = new BuyService()
            yield buyService.executeOrder(
                state.account,
                state.provider,
                payload.asset,
                payload.price,
                payload.fingerprint);
        } catch (e) {
            console.error(e)
            // dispatch error
        }
        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* buySaga() {
    // only the take the latest fetch result
    yield takeLatest(buyRequest().type, handleBuyRequest)
}