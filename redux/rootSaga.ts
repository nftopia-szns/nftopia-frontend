import { all } from 'redux-saga/effects';
import assetSaga from './features/asset/asset.saga';
import bidSaga from './features/bid/bid.saga';
import searchSaga from './features/search/search.saga';

export default function* rootSaga() {
    yield all([
        searchSaga(),
        assetSaga(),
        bidSaga()
    ])
}