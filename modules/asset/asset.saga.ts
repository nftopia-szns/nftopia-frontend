import { PayloadAction } from "@reduxjs/toolkit"
import { put, takeLatest } from 'redux-saga/effects';
import { AssetBriefInfo, fetchAsset, fetchAssetSuccess } from "./asset-slice";
import searchById from "../../pages/api/asset";
import { DecentralandSearchHitDto, SearchResultDto } from "../../components/search/search.types";

export function* handleFetchAsset(action: PayloadAction<AssetBriefInfo>) {
    try {
        const _searchResults: SearchResultDto<DecentralandSearchHitDto> = yield searchById(action.payload.id)

        console.log(_searchResults);
        // dispatch action from saga
        yield put(fetchAssetSuccess(_searchResults.hits[0]._source))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(fetchAsset().type, handleFetchAsset)
}