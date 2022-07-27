import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/search-slice';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga';
import assetReducer from './asset/asset-slice';
import bidReducer from './bid/bid-slice';
import saleReducer from './sale/sale-slice';
import walletReducer from './wallet/wallet-slice';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        search: searchReducer,
        asset: assetReducer,
        bid: bidReducer,
        sale: saleReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'wallet/setEthWallet',
                    'bid/bidRequest',
                    'bid/createBid',
                    'bid/cancelBidRequest',
                    'bid/acceptBidRequest',
                    'sale/buyRequest',
                    'sale/sellRequest',
                    'sale/stopSellingRequest',
                    'search/searchStart',
                ],
                // Ignore these field paths in all actions
                // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: [
                    'wallet.ethWallet',
                    'payload.query'
                ],
            },
            thunk: false
        }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;