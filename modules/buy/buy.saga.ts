import { PayloadAction } from "@reduxjs/toolkit"
import { takeLatest } from 'redux-saga/effects';
import { BuyPayload, buyRequest } from "./buy-slice";
import { BuyService } from "./buy.service";

export function* handleBuyRequest(action: PayloadAction<BuyPayload>) {
    try {
        const payload = action.payload

        const buyService = new BuyService()
        yield buyService.executeOrder(
            payload.caller,
            payload.provider,
            payload.asset,
            payload.price,
            payload.fingerprint);

        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(buyRequest().type, handleBuyRequest)
}