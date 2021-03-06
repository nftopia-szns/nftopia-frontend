import { all } from 'redux-saga/effects';
import assetSaga from './asset/asset.saga';
import bidSaga from './bid/bid.saga';
import saleSaga from './sale/sale.saga';
import searchSaga from './search/search.saga';
import walletSaga from './wallet/wallet-saga';

export default function* rootSaga() {
    yield all([
        walletSaga(),
        searchSaga(),
        assetSaga(),
        bidSaga(),
        saleSaga(),
    ])
}