import { PayloadAction } from "@reduxjs/toolkit"
import {
    BSCChainId,
    EthereumChainId,
    Network,
    PolygonChainId,
    toCanonicalBSCChainId,
    toCanonicalEthereumChainId,
    toCanonicalPolygonChainId
} from "nftopia-shared/dist/shared/network";
import { put, select, takeLatest } from 'redux-saga/effects';
import { AssetState } from "../asset/asset-slice";
import { RootState } from "../store";
import {
    requireEthWalletConnected,
    setEthRequiredChainId
} from "../wallet/wallet-slice";
import {
    BuyPayload,
    buyRequest,
    SellPayload,
    sellRequest,
    setAssetForSale,
    setBuyModalRequired,
    CancelSellingPayload,
    cancelSellingRequest,
    setSellModalRequired
} from "./sale-slice";
import { SaleService } from "./sale.service";

export default function* saleSaga() {
    // only the take the latest fetch result
    yield takeLatest(setBuyModalRequired().type, handleSetBuyModalRequired)
    yield takeLatest(setSellModalRequired().type, handleSetSellModalRequired)
    yield takeLatest(buyRequest().type, handleBuyRequest)
    yield takeLatest(sellRequest().type, handleSellRequest)
    yield takeLatest(cancelSellingRequest().type, handleStopSellingRequest)
}

export function* handleSetBuyModalRequired(action: PayloadAction<boolean>) {
    // do nothing if modal is deactivated
    if (action.payload === false) return

    const assetState: AssetState = yield select((state: RootState) => state.asset as AssetState)
    const asset = assetState.assetDetail

    yield put(setAssetForSale(asset))

    switch (asset.network) {
        case Network.Ethereum:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)))
            break;

        case Network.BSC:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalBSCChainId(asset.chain_id as BSCChainId)))
            break;

        case Network.Polygon:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalPolygonChainId(asset.chain_id as PolygonChainId)))
            break;

        default:
            console.error(`Buy isn't support for network: ${asset.network}, chainid ${asset.chain_id}`);
            yield put(setBuyModalRequired(false))
            break;
    }
}

export function* handleSetSellModalRequired(action: PayloadAction<boolean>) {
    // do nothing if modal is deactivated
    if (action.payload === false) return

    const assetState: AssetState = yield select((state: RootState) => state.asset as AssetState)
    const asset = assetState.assetDetail

    yield put(setAssetForSale(asset))

    switch (asset.network) {
        case Network.Ethereum:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)))
            break;

        case Network.BSC:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalBSCChainId(asset.chain_id as BSCChainId)))
            break;

        case Network.Polygon:
            yield put(requireEthWalletConnected())
            yield put(setEthRequiredChainId(toCanonicalPolygonChainId(asset.chain_id as PolygonChainId)))
            break;

        case Network.Solana:
        default:
            console.error(`Sell isn't support for network: ${asset.network}, chainid ${asset.chain_id}`);
            yield put(setSellModalRequired(false))
            break;
    }
}

export function* handleBuyRequest(action: PayloadAction<BuyPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const saleService = new SaleService()
        yield saleService.buy(state, payload);

        //     dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleSellRequest(action: PayloadAction<SellPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const saleService = new SaleService()
        yield saleService.createAsk(state, payload);

        //     dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export function* handleStopSellingRequest(action: PayloadAction<CancelSellingPayload>) {
    try {
        const payload = action.payload
        const state: RootState = yield select((state: RootState) => state)

        const saleService = new SaleService()
        yield saleService.cancelAsk(state, payload);

        //     dispatch action from saga
        //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}
