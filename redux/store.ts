import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './features/search/search-slice';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        search: searchReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;