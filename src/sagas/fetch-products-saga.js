import { put, take } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch';
/**
 * Fetch products saga gets a list of all new
 * products in response to a particular view being loaded
 */
export default function * () {
    while (true) {
        /**
         * Wait for a request to fetch products, then fetch data from the API and notify the application
         * that new products have been loaded.
         */
        yield take(`REQUEST_FETCH_PRODUCTS`);
        const raw = yield fetch('/api/products');
        const json = yield raw.json();
        const products = json.items;
        yield put({type:`FETCHED_PRODUCTS`, products});
    }
}