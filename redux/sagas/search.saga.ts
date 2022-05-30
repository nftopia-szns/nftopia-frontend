import { PayloadAction } from "@reduxjs/toolkit"
import { DecentralandSearchHitDto, SearchResultDto } from '../../components/search/search.types';
import { searchStart, searchSuccess } from '../features/search/search-slice';
import searchApi from '../../pages/api/search'
import { put, takeLatest } from 'redux-saga/effects';

export function* search(action: PayloadAction<{ query: string, page: number, pageSize: number }>) {
    try {
        const payload = action.payload
        const _searchResults: SearchResultDto<DecentralandSearchHitDto> = yield searchApi<DecentralandSearchHitDto>(payload.query, payload.page, payload.pageSize)

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