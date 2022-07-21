import { PayloadAction } from "@reduxjs/toolkit"
import { searchStart, searchSuccess } from './search-slice';
import { put, takeLatest } from 'redux-saga/effects';
import { SearchDto } from "../../pages/api/search/search.types";
import { enhancedSearch } from "../../pages/api/search";
import { GenericAssetDto } from "nftopia-shared/dist/shared/asset/types";

export function* search(action: PayloadAction<SearchDto>) {
    try {
        const searchDto = action.payload
        const _searchResults = yield enhancedSearch<GenericAssetDto>(searchDto)

        // dispatch action from saga
        yield put(searchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* searchSaga() {
    // only the take the latest search result
    yield takeLatest(searchStart().type, search)
}