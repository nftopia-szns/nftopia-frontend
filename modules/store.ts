import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/search-slice';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga';
import assetReducer from './asset/asset-slice';
import bidReducer from './bid/bid-slice';
import buyReducer from './buy/buy-slice';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        search: searchReducer,
        asset: assetReducer,
        bid: bidReducer,
        buy: buyReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'bid/bidRequest',
                    'buy/buyRequest',
                ],
                // Ignore these field paths in all actions
                // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                // ignoredPaths: ['items.dates'],
            },
            thunk: false
        }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;