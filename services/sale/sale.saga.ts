import { PayloadAction } from "@reduxjs/toolkit"
import { select, takeLatest } from 'redux-saga/effects';
import { WalletState } from "../wallet/wallet-slice";
import { BuyPayload, buyRequest, SellPayload, sellRequest, StopSellingPayload, stopSellingRequest } from "./sale-slice";
import { SaleService } from "./sale.service";

export function* handleBuyRequest(action: PayloadAction<BuyPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.executeOrder(
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

export function* handleSellRequest(action: PayloadAction<SellPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.createOrder(
                state.provider,
                payload.asset,
                payload.price,
                payload.expiresAt);
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


export function* handleStopSellingRequest(action: PayloadAction<StopSellingPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.cancelOrder(
                state.provider,
                payload.asset);
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

export default function* saleSaga() {
    // only the take the latest fetch result
    yield takeLatest(buyRequest().type, handleBuyRequest)
    yield takeLatest(sellRequest().type, handleSellRequest)
    yield takeLatest(stopSellingRequest().type, handleStopSellingRequest)
}