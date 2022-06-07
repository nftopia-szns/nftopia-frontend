import { PayloadAction } from "@reduxjs/toolkit"
import { searchStart, searchSuccess } from './search-slice';
import { put, takeLatest } from 'redux-saga/effects';
import { DecentralandSearchHitDto, SearchDto } from "../../pages/api/search/search.types";
import { enhancedSearch } from "../../pages/api/search";

export function* search(action: PayloadAction<SearchDto>) {
    try {
        const payload = action.payload
        const _searchResults = yield enhancedSearch<DecentralandSearchHitDto>(payload)

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