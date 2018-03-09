import unionWith from 'lodash/unionWith';

/**
 * Products reducer, deals mostly with actions dispatched from sagas.
 */
export const products = (state = [],{type,product,products})=>{
    /**
     * Product Equality returns true if two products are equal, based on a weak check of their code property
     * @param a
     * The first product
     * @param b
     * The second product
     * @returns {boolean}
     * Whether the products are equal
     */
    const productEquality = (a = {},b = {})=>{
        return a.code == b.code
    };

    /**
     * Create a new state by combining the existing state with the product(s) that has been newly fetched
     */
    if (type === `FETCHED_PRODUCT`) {
        state = unionWith([product],state,productEquality);
    }

    if (type === `FETCHED_PRODUCTS`) {
        state = unionWith(state,products,productEquality);
    }
    return state;
};