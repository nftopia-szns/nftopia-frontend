import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './features/search/search-slice';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga';
import assetReducer from './features/asset/asset-slice';
import bidReducer from './features/bid/bid-slice';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        search: searchReducer,
        asset: assetReducer,
        bid: bidReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;