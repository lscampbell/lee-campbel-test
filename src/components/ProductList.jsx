import React from 'react';
import ProductListItem from './ProductListItem';
import { connect } from 'react-redux';

/**
 * Display all products in an array provided to it as a simple list
 */
let i = 0;
const ProductList = ({products})=>(
    <fieldset>
        { products ?
            <div className="row">
                {
                    products.map(product =><ProductListItem key={product.code} {...product}/>)
                }
            </div> :
            <div>
                Loading products...
            </div>
        }
    </fieldset>
);

/**
 * Get the list of products from the application's state
 * It is populated by a ../sagas/fetch-product(s)-saga.
 */
const mapStateToProps = ({products})=>({
    products
});

/**
 * Create and export a connected component
 */
export default connect(mapStateToProps)(ProductList);