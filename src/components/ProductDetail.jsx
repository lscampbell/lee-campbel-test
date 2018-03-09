import React from 'react';
import Markdown from 'react-markdown';
import { connect } from 'react-redux';

/**
 * Product Detail Display outputs a view containing product information when passed a product
 * as its prop
 * If no product is found, that means the saga that is loading it has not completed, and display an interim message
 */
const ProductDetailDisplay = ({name})=>(
    <div>
        <h3 className="mb-2">
            {name}
        </h3>
    </div>
);

const mapStateToProps = (state,ownProps)=>({
    /**
     * Find the product in the state that matches the ID provided and pass it to the display component
     */
    ...state.products.find(({code})=>code == ownProps.code)
});

/**
 * Create and export a connected component
 */
export default connect(mapStateToProps)(ProductDetailDisplay);