import { PayloadAction } from "@reduxjs/toolkit"
import {
    BSCChainId,
    EthereumChainId,
    Network,
    toCanonicalBSCChainId,
    toCanonicalEthereumChainId
} from "nftopia-shared/dist/shared/network";
import { MetaversePlatform } from "nftopia-shared/dist/shared/platform";
import { put, select, takeLatest } from 'redux-saga/effects';
import { AssetState } from "../asset/asset-slice";
import { RootState } from "../store";
import {
    requireEthChainIdMatched,
    requireEthWalletConnected,
    setEthRequiredChainId,
    WalletState
} from "../wallet/wallet-slice";
import {
    BuyPayload,
    buyRequest,
    SellPayload,
    sellRequest,
    setAssetForSale,
    setBuyModalRequired,
    StopSellingPayload,
    stopSellingRequest
} from "./sale-slice";
import { SaleService } from "./sale.service";

export function* handleSetBuyModalRequired(action: PayloadAction<boolean>) {
    // do nothing if modal is deactivated
    if (action.payload === false) return

    const assetState: AssetState = yield select((state: RootState) => state.asset as AssetState)
    const asset = assetState.assetDetail

    yield put(setAssetForSale(asset))

    switch (asset.platform) {
        case MetaversePlatform.Decentraland:
            yield (put(requireEthWalletConnected()))

            if (asset.network === Network.Ethereum) {
                yield put(setEthRequiredChainId(toCanonicalEthereumChainId(asset.chain_id as EthereumChainId)))
            }
            if (asset.network === Network.BSC) {
                yield put(setEthRequiredChainId(toCanonicalBSCChainId(asset.chain_id as BSCChainId)))
            }
            yield (put(requireEthChainIdMatched()))

            break;
        default:
            console.error(`Buy isn't support for platform: ${asset.platform}`);
            yield put(setBuyModalRequired(false))
            break;
    }
}

export function* handleBuyRequest(action: PayloadAction<BuyPayload>) {
    try {
        const payload = action.payload
        const walletState: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.executeOrder(
                walletState.ethWallet.account,
                walletState.ethWallet.provider,
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
        const walletState: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.createOrder(
                walletState.ethWallet.provider,
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
        const walletState: WalletState = yield select((state) => state.wallet as WalletState)

        try {
            const saleService = new SaleService()
            yield saleService.cancelOrder(
                walletState.ethWallet.provider,
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