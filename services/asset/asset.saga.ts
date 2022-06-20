import { PayloadAction } from "@reduxjs/toolkit"
import { put, takeLatest } from 'redux-saga/effects';
import { AssetBriefInfo, fetchAsset, fetchAssetSuccess } from "./asset-slice";
import { enhancedSearch } from "../../pages/api/search";
import { QueryBuilder } from "../../pages/api/search/search.utils";
import { DecentralandSearchHitDto, SearchDto, SearchResultDto } from "../../pages/api/search/search.types";

export function* handleFetchAsset(action: PayloadAction<AssetBriefInfo>) {
    try {
        const query = new QueryBuilder().matchQuery([{ field: "id", query: action.payload.id }])
        const searchDto: SearchDto = {
            indices: ["decentraland-ethereum-3"],
            query,
        } 

        const _searchResults: SearchResultDto<DecentralandSearchHitDto> = yield enhancedSearch(searchDto)

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