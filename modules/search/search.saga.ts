import { PayloadAction } from "@reduxjs/toolkit"
import { searchStart, searchSuccess } from './search-slice';
import { put, select, takeLatest } from 'redux-saga/effects';
import { DecentralandSearchHitDto, SearchDto } from "../../pages/api/search/search.types";
import { enhancedSearch } from "../../pages/api/search";

export function* search(action: PayloadAction<SearchDto>) {
    try {
        const searchDto = action.payload
        const _searchResults = yield enhancedSearch<DecentralandSearchHitDto>(searchDto)

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