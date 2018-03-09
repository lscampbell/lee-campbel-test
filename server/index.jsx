import path from 'path';
import express from 'express';
import webpack from 'webpack';
import yields from 'express-yields';
import fs from 'fs-extra';
import App from '../src/App';
import { delay } from 'redux-saga';
import { renderToString } from 'react-dom/server'
import React from 'react'
import { argv } from 'optimist';
import { products, product } from '../data/api-real-url';
import rp from 'request-promise';
import { ConnectedRouter } from 'react-router-redux';
import getStore from '../src/getStore'
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';
import tough from 'tough-cookie';

/**
 * Try and find a specific port as provided by an external cloud host, or go with a default value
 */
const port = process.env.PORT || 3000;
const app = express();

/**
 * Get basic configuration settings from arguments
 * This can be replaced with webpack configuration or other global variables as required
 * When useServerRender is true, the application will be pre-rendered on the server. Otherwise,
 * just the normal HTML page will load and the app will bootstrap after it has made the required AJAX calls
 */
const useServerRender = argv.useServerRender === 'true';

/**
 * When useLiveData is true, the application attempts to contact Stackoverflow and interact with its actual API.
 * NOTE: Without an API key, the server will cut you off after 300 requests. To solve this, get an API key from
 * Stackoverflow (for free at https://stackapps.com/apps/oauth/register)
 * OR, just disable useLiveData
 */
const useLiveData = argv.useLiveData === 'true';

/**
 * The block below will run during development and facilitates live-reloading
 * If the process is development, set up the full live reload server
 */
if(process.env.NODE_ENV === 'development') {
    /**
     * Get the development configuration from webpack.config.
     */
    const config = require('../webpack.config.dev.babel.js').default;

    /**
     * Create a webpack compiler which will output our bundle.js based on the application's code
     */
    const compiler = webpack(config);

    /**
     * Use webpack-dev-middleware, which facilitates creating a bundle.js in memory and updating it automatically
     * based on changed files
     */
    app.use(require('webpack-dev-middleware')(compiler,{
        /**
         * @noInfo Only display warnings and errors to the concsole
         */
        noInfo: true,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    }));

    /**
     * Hot middleware allows the page to reload automatically while we are working on it.
     * Can be used instead of react-hot-middleware if Redux is being used to manage app state
     */
    app.use(require('webpack-hot-middleware')(compiler));
} else {
    /**
     * If the process is production, just serve the file from the dist folder
     * Build should have been run beforehand
     */
    app.use(express.static(path.resolve(__dirname, '../dist')));
}

/**
 * Returns a response object with an [items] property containing a list of the 30 or so newest products
 */
function * getProducts (){
    let data;
    if (useLiveData) {
        /**
         * If live data is used, contact the external API
         */
        var options = {
            method: "GET", 
            headers: {
                "User-Agent": "My little demo app"
            },
            uri: products,
            gzip:true,
        };

        data = `{ "items": ${yield rp(options)} }`;
    } else {
        /**
         * If live data is not used, read the mock products file
         */
        data = `{ "items": ${yield fs.readFile('./data/mock-products.json',"utf-8")} }`;
    }
    
    /**
     * Parse the data and return it
     */
    return JSON.parse(data);
}

function * getProduct (code) {
    let data;
    if (useLiveData) {
        /**
         * If live data is used, contact the external API
         */
        var options = {
            method: "GET", 
            headers: {
                "User-Agent": "My little demo app"
            },
            uri: product(code),
            gzip:true
        };

        data = JSON.parse(`{ "items": ${yield rp(options)} }`);
    } else {
        /**
         * If live data is not used, get the list of mock products and return the one that
         * matched the provided ID
         */
        const products = yield getProducts();
        const product = products.items.find(_product=>_product.code == code);
        /**
         * Create a mock body for the product
         */
        //product.body = `Mock product body: ${code}`;
        data = { items: [product]};
    }
    return data;
}

/**
 * Creates an api route localhost:3000/api/products, which returns a list of products
 * using the getProducts utility
 */
app.get('/api/products',function *(req,res){
    const data = yield getProducts();
    /**
     * Insert a small delay here so that the async/hot-reloading aspects of the application are
     * more obvious. You are strongly encouraged to remove the delay for production.
     */
    yield delay(150);
    res.json(data);
});

/**
 * Special route for returning detailed information on a single product
 */
app.get('/api/product/:id',function *(req,res){
    const data = yield getProduct(req.params.id);
    /**
     * Remove this delay for production.
     */
    yield delay(150);
    res.json(data);
});

/**
 * Create a route that triggers only when one of the two view URLS are accessed
 */
app.get(['/', '/product/:id'], function *(req,res){
    /**
     * Read the raw index HTML file
     */
    let index = yield fs.readFile('./public/index.html', "utf-8");

    /**
     * Create a memoryHistory, which can be
     * used to pre-configure our Redux state and routes
     */
    const history = createHistory({
        /**
         * By setting initialEntries to the current path, the application will correctly render into the
         * right view when server rendering
         */
        initialEntries: [req.path],
    });

    /**
     * Create a default initial state which will be populated based on the route
     */
    const initialState = {
        products:[]
    };

    /**
     * Check to see if the route accessed is the "product detail" route
     */
    if (req.params.id) {
        /**
         * If there is req.params.id, this must be the product detail route.
         * You are encouraged to create more robust conditions if you add more routes
         */
        const code = req.params.id;
        /**
         * Get the product that corresponds to the request, and preload the initial state with it
         */
        const response = yield getProduct(code);
        const productDetails = response.items[0];
        initialState.products = [{...productDetails,code}];
    } else {
        /**
         * Otherwise, we are on the "new products view", so preload the state with all the new products (not including their bodies or answers)
         */
        const products = yield getProducts();
        initialState.products = [...products.items]
    }

    /**
     * Create a redux store that will be used only for server-rendering our application (the client will use a different store)
     */
    const store = getStore(history,initialState);

    /**
     * If server render is used, replace the specified block in index with the application's rendered HTML
     */
    if (useServerRender) {
        const appRendered = renderToString(
            /**
             * Surround the application in a provider with a store populated with our initialState and memoryHistory
             */
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </Provider>
        );
        index = index.replace(`<%= preloadedApplication %>`,appRendered)
    } else {
        /**
         * If server render is not used, just output a loading message, and the application will appear
         * when React boostraps on the client side.
         */
        index = index.replace(`<%= preloadedApplication %>`,`Please wait while we load the application.`);
    }
    res.send(index);
});

/**
 * Listen on the specified port for requests to serve the application
 */
app.listen(port, '0.0.0.0', () => console.info(`Listening at http://localhost:${port}`));