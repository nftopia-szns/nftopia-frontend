import { PayloadAction } from "@reduxjs/toolkit"
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";
import { EthereumChainId, toCanonicalEthereumChainId } from "nftopia-shared/dist/shared/network";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { put, select, takeLatest } from 'redux-saga/effects';
import { setEthRequireSwitchChainIdPopup, setEthRequireWalletConnectPopup, WalletState } from "../wallet/wallet-slice";
import { AcceptBidPayload, acceptBidRequest, BidPayload, bidRequest, CancelBidPayload, cancelBidRequest, openBidModal, setBidModalVisible } from "./bid-slice";
import { BidService } from "./bid.service";

export function* handleOpenBidModal(action: PayloadAction<GenericAssetDto>) {
    console.log('open bid modal requested');

    const state: WalletState = yield select((state) => state.wallet as WalletState)
    const ethWallet = state.ethWallet
    const asset = action.payload

    switch (asset.platform) {
        case MetaversePlatform.Decentraland:
            // case MetaversePlatform.Cryptovoxels:
            // case MetaversePlatform.SandBox:

            const isWalletConnected = ethWallet?.account && ethWallet?.provider && true
            const isChainIdMatched = ethWallet?.chainId ===
                toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)

            console.log(isWalletConnected, isChainIdMatched);
            
            yield put(setBidModalVisible(isWalletConnected && isChainIdMatched))
            yield put(setEthRequireWalletConnectPopup(!isWalletConnected))
            yield put(setEthRequireSwitchChainIdPopup(!isChainIdMatched))
            break;

        default:
            console.error(`Bid isn't support for platform: ${asset.platform}`);
            yield put(setBidModalVisible(false))
    }
}

export function* handleBidRequest(action: PayloadAction<BidPayload>) {
    try {
        const payload = action.payload
        const state: WalletState = yield select((state) => state.wallet as WalletState)


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

export function* handleAcceptBidRequest(action: PayloadAction<AcceptBidPayload>) {
    try {
        const payload = action.payload

        const bidService = new BidService()
        yield bidService.accept(
            payload.sender,
            payload.recipient,
            payload.provider,
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
    yield takeLatest(bidRequest().type, handleBidRequest)
    yield takeLatest(acceptBidRequest().type, handleAcceptBidRequest)
    yield takeLatest(cancelBidRequest().type, handleCancelBidRequest)
    yield takeLatest(openBidModal().type, handleOpenBidModal)
}

function ethRequireWalletConnectPopup(arg0: boolean): any {
    throw new Error("Function not implemented.");
}
