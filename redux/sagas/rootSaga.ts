import { all } from 'redux-saga/effects';
import searchSaga from './search.saga';

export default function* rootSaga() {
    console.log('Root saga');
    yield all([searchSaga()])
    
}