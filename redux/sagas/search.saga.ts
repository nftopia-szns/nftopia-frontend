import { takeEvery, put } from '@redux-saga/core/effects'
import { PayloadAction } from "@reduxjs/toolkit"
import { DecentralandSearchHitDto, SearchResultDto } from '../../components/search/search.types';
import { searchStart, searchSuccess } from '../features/search/search-slice';
import searchApi from '../../pages/api/search'

export function* search(action: PayloadAction<{ query: string, page: number, pageSize: number }>) {
    try {
        const payload = action.payload
        const _searchResults: SearchResultDto<DecentralandSearchHitDto> = yield searchApi<DecentralandSearchHitDto>(payload.query, payload.page, payload.pageSize)

        yield put(searchSuccess(_searchResults))
    } catch (e) {
        console.error(e)
    }
}

export default function* searchSaga() {
    console.log('hello saga');
    yield takeEvery(searchStart().type, search)
}