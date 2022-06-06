import { PayloadAction } from "@reduxjs/toolkit"
import fetchApi from '../../pages/api/asset'
import { put, takeLatest } from 'redux-saga/effects';

// export function* fetch(action: PayloadAction<{ contractAddress: string, tokenId: string }>) {
//     try {
//         const payload = action.payload
//         const _searchResults = yield fetchApi(payload.contractAddress, payload.tokenId)

//         // dispatch action from saga
//         yield put(fetchSuccess(_searchResults))
//     } catch (e) {
//         console.error(e)
//     }
// }

export default function* fetchSaga() {
    // only the take the latest fetch result
    // yield takeLatest(fetchStart().type, fetch)
}