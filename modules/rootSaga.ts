import { all } from 'redux-saga/effects';
import assetSaga from './asset/asset.saga';
import bidSaga from './bid/bid.saga';
import searchSaga from './search/search.saga';

export default function* rootSaga() {
    yield all([
        searchSaga(),
        assetSaga(),
        bidSaga()
    ])
}