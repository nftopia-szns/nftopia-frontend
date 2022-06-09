import { PayloadAction } from "@reduxjs/toolkit"
import { takeLatest } from 'redux-saga/effects';
import { BidPayload, bidRequest } from "./bid-slice";
import { BidService } from "./bid.service";

export function* handleBidRequest(action: PayloadAction<BidPayload>) {
    try {
        const payload = action.payload

        const bidService = new BidService()
        yield bidService.place(
            payload.caller,
            payload.provider,
            payload.asset,
            payload.price,
            payload.duration,
            payload.fingerprint);

        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(bidRequest().type, handleBidRequest)
}