import { PayloadAction } from "@reduxjs/toolkit"
import { put, select, takeLatest } from 'redux-saga/effects';
import { AssetBriefInfo, fetchAsset, fetchAssetSuccess, fetchNearbyAssets, setNearbyAssets } from "./asset-slice";
import { enhancedSearch } from "../../pages/api/search";
import { QueryBuilder } from "../../pages/api/search/search.utils";
import { SearchDto, SearchResultDto } from "../../pages/api/search/search.types";
import { buildSearchNearbyAssets } from "./asset.utils";
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";

export function* handleFetchAsset(action: PayloadAction<AssetBriefInfo>) {
    try {
        const query = new QueryBuilder().matchQuery([{ field: "id", query: action.payload.id }])
        const searchDto: SearchDto = {
            indices: [action.payload.index],
            query,
        }

        const _searchResults: SearchResultDto<GenericAssetDto> = yield enhancedSearch(searchDto)

        // dispatch action from saga
        yield put(fetchAssetSuccess(_searchResults.hits[0]._source))
    } catch (e) {
        console.error(e)
    }
}

export function* handleFetchNearbyAssets(action: PayloadAction) {
    try {
        const assetState = yield select(((state) => state.asset))

        const searchNearbyAssetsSearchDto: SearchDto = buildSearchNearbyAssets(assetState.platform, assetState.assetDetail)
        
        const _searchResults: SearchResultDto<object> = yield enhancedSearch(searchNearbyAssetsSearchDto)

        // dispatch action from saga
        yield put(setNearbyAssets(_searchResults.hits))
    } catch (e) {
        console.error(e)
    }
}

export default function* fetchSaga() {
    // only the take the latest fetch result
    yield takeLatest(fetchAsset().type, handleFetchAsset)
    yield takeLatest(fetchNearbyAssets().type, handleFetchNearbyAssets)
}