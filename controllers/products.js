/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const { sendJson } = require('../utils/responseUtils');
const responseUtils = require('../utils/responseUtils');

const getAllProducts = async response => {
  const productData = await require('../products.json').map(product => ({ ...product }));
  responseUtils.sendJson(response, productData);
};

module.exports = { getAllProducts };
