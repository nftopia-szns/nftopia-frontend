import { PayloadAction } from "@reduxjs/toolkit"
import { Network, PolygonChainId, toCanonicalPolygonChainId } from "nftopia-shared/dist/shared/network";
import { put, select, takeLatest } from 'redux-saga/effects';
import { AssetState } from "../asset/asset-slice";
import { RootState } from "../store";
import {
    requireEthWalletConnected,
    setEthRequiredChainId} from "../wallet/wallet-slice";
import {
    AcceptBidPayload,
    CancelBidPayload,
    CreateBidPayload,
    createBid,
    cancelBid,
    acceptBid,
    setAssetForBid,
    setBidModalRequired,
} from "./bid-slice";
import { BidService } from "./bid.service";

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(setBidModalRequired().type, handleSetBidModalRequired)
    yield takeLatest(createBid().type, handleCreateBid)
    yield takeLatest(acceptBid().type, handleAcceptBid)
    yield takeLatest(cancelBid().type, handleCancelBid)
}

export function* handleSetBidModalRequired(action: PayloadAction<boolean>) {
    // do nothing when bid modal is deactivated
    if (action.payload === false) return

    const assetState: AssetState = yield select((state: RootState) => state.asset as AssetState)
    const asset = assetState.assetDetail

    // set asset for bidding state
    yield put(setAssetForBid(asset))

    switch (asset.network) {
        case Network.Polygon:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalPolygonChainId(asset.chain_id as PolygonChainId)))
            break;

        default:
            console.error(`Bid isn't support for network: ${asset.network}, chainid ${asset.chain_id}`);
            yield put(setBidModalRequired(false))
            break;
    }
}

export function* handleCreateBid(action: PayloadAction<CreateBidPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const bidService = new BidService()
        yield bidService.createBid(
            state,
            payload,
        );

        //     dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleAcceptBid(action: PayloadAction<AcceptBidPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const bidService = new BidService()
        yield bidService.acceptBid(
            state,
            payload,
        );

        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleCancelBid(action: PayloadAction<CancelBidPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const bidService = new BidService()
        yield bidService.cancelBid(
            state,
            payload,
        );

        //     dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}
