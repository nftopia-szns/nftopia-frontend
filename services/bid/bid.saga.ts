import { PayloadAction } from "@reduxjs/toolkit"
import { Network, PolygonChainId, toCanonicalPolygonChainId } from "nftopia-shared/dist/shared/network";
import { put, select, takeLatest } from 'redux-saga/effects';
import { AssetState } from "../asset/asset-slice";
import { RootState } from "../store";
import {
    requireEthWalletConnected,
    setEthRequiredChainId,
    WalletState
} from "../wallet/wallet-slice";
import {
    AcceptBidPayload,
    acceptBidRequest,
    CancelBidPayload,
    cancelBidRequest,
    createBid,
    CreateBidPayload,
    setAssetForBid,
    setBidModalRequired
} from "./bid-slice";
import { BidService } from "./bid.service";

export function* handleSetBidModalRequired(action: PayloadAction<boolean>) {
    // do nothing when bid modal is deactivated
    if (action.payload === false) return

    const assetState: AssetState = yield select((state: RootState) => state.asset as AssetState)
    const asset = assetState.assetDetail

    // set asset for bidding state
    yield put(setAssetForBid(asset))

    switch (asset.network) {
        case Network.Polygon:
            yield (put(requireEthWalletConnected()))
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
        const state: WalletState = yield select((state) => state.wallet as WalletState)

        const bidService = new BidService()
        yield bidService.createBid(
            state,
            payload,
        );

        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleAcceptBidRequest(action: PayloadAction<AcceptBidPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)

        const bidService = new BidService()
        yield bidService.accept(
            state.ethWallet.provider,
            state.ethWallet.account,
            payload.recipient,
            payload.asset);
        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleCancelBidRequest(action: PayloadAction<CancelBidPayload>) {
    try {
        const payload = action.payload

        const bidService = new BidService()
        yield bidService.cancel(
            payload.provider,
            payload.asset);

        //     // dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(setBidModalRequired().type, handleSetBidModalRequired)
    yield takeLatest(createBid().type, handleCreateBid)
    yield takeLatest(acceptBidRequest().type, handleAcceptBidRequest)
    yield takeLatest(cancelBidRequest().type, handleCancelBidRequest)
}