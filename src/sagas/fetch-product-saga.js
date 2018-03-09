import { takeEvery, put } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch';

export default function * () {
    /**
     * Every time REQUEST_FETCH_PRODUCT, fork a handleFetchProduct process for it
     */
    yield takeEvery(`REQUEST_FETCH_PRODUCT`, handleFetchProduct);
}

/**
 * Fetch product details from the local proxy API
 */
function * handleFetchProduct ({code}) {
    const raw = yield fetch(`/api/product/${code}`);
    const json = yield raw.json();
    const product = json.items[0];
    /**
     * Notify application that product has been fetched
     */
    yield put({type:`FETCHED_PRODUCT`, product});
}