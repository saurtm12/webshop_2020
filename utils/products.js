const fs = require('fs');
const data = {
  // make copies of products (prevents changing from outside this module/file)
  products: require('../products.json').map(product => ({ ...product })),
  roles: ['customer', 'admin']
};

/**
 * Reset products back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetProducts = () => {
  // make copies of products (prevents changing from outside this module/file)
  data.products = require('../products.json').map(product => ({ ...product }));
};

/**
 * Return all products
 *
 * Returns copies of the products and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<object>} all products
 */
const getAllProducts = () => {
  const productData = data.products;
  const returnedData = JSON.parse(JSON.stringify(productData));
  return returnedData;
};

module.exports = {
    getAllProducts
};
