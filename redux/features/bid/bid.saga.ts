import { PayloadAction } from "@reduxjs/toolkit"
import fetchApi from '../../../pages/api/asset'
import { put, takeLatest } from 'redux-saga/effects';
import { onPlaceBid } from "./bid-slice";
import { ERC721Bid__factory } from "../../../contracts/bid-contract/typechain-types";
// import { fetchStart, fetchSuccess } from "./bid-slice";

export function* placeBid(action: PayloadAction<{ contractAddress: string, tokenId: string }>) {
    
    
    // ERC721Bid__factory.connect()
    
    try {
    //     const payload = action.payload
    //     const _searchResults = yield fetchApi(payload.contractAddress, payload.tokenId)

    //     // dispatch action from saga
    //     yield put(fetchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(onPlaceBid().type, placeBid)
}