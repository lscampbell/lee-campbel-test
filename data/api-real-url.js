/**
 * The URL to receive a list of products in JSON.
 * Works if you paste it into your browser's URL bar.
 */
export const products = `https://www.matchesfashion.com/nms/ajax/p/1095470,1095483,1095472,1095461`;
/**
 * The URL to receive details on a single product.
 * This request also returns the body of the product
 * @param id
 * The product ID to fetch
 */
export const product = (id)=>`https://www.matchesfashion.com/nms/ajax/p/${id}`;