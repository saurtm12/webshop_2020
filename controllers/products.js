/**
 * Send all products as JSON
 *
 * @param {object} response http.ServerResponse
 * @returns {object} response
 */
const { isJson} = require('../utils/requestUtils');
const responseUtils = require('../utils/responseUtils');
const { sendJson } = require('../utils/responseUtils');

const getAllProducts = async response => {
  const Product = await require('../models/product');
  const productData = await Product.find();
  sendJson(response, productData);
};

/**
 * Register new product and send created product back as JSON
 *
 * @param {object} response http.ServerResponse
 * @param {object} productData JSON data from request boy
 * @returns {object} created product as json
 */
const registerProduct = async (response, productData) => {
  if (!productData.price || (productData.price && productData.price <= 0)){
      return responseUtils.badRequest(response, "Invalid price");
  }
  if(!productData.name) {
    return responseUtils.badRequest(response, "Invalid name");
  }

  const Product = await require('../models/product');
  const newProduct = new Product({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    image: productData.image
  });
  await newProduct.save();
  return responseUtils.createdResource(response, newProduct);
};


/**
 * Send product data as JSON
 *
 * @param {object} response http.ServerResponse
 * @param {string} productId products ID
 * @returns {object} either product as json or not found
 */
const viewProduct = async (response, productId) => {
  const Product = await require('../models/product');
  const vProduct = await Product.findById(productId).exec();
  if (!vProduct){
    return responseUtils.notFound(response);
  }
  else{
    return responseUtils.sendJson(response, vProduct);
  }
};

/**
 * Update product and send updated product as JSON
 *
 * @param {object} response http.ServerResponse
 * @param {string} productId products ID 
 * @param {object} productData JSON data from request body
 * @returns {object} response
 */
const updateProduct = async (response, productId, productData) => {

  if (!productData.name) {
    return responseUtils.badRequest(response, "Missing name");
  }
  if(productData.price <= 0) {
    return responseUtils.badRequest(response, "Invalid price");
  }

  const Product = await require('../models/product');
  const fProduct = await Product.findById(productId).exec();

  if (!fProduct) {
    return responseUtils.notFound(response);
  }

  if (fProduct) {
    fProduct.name = productData.name;
    fProduct.price = productData.price;
  }
  if (productData.description !== undefined) { 
    fProduct.description = productData.description;
  }
  if (productData.image !== undefined) {
    fProduct.image = productData.image;
  }

  await fProduct.save();
  
  return responseUtils.sendJson(response, fProduct);
};

/**
 * Delete product and send deleted product as JSON
 *
 * @param {object} response http.ServerResponse
 * @param {string} productId products ID 
 * @returns {object} response
 */
const deleteProduct = async (response, productId) => {
  const Product = await require('../models/product');
  const fProduct = await Product.findById(productId).exec();
  if (!fProduct){
    return responseUtils.notFound(response);
  }
  await Product.deleteOne({_id: productId}).then(() => 
  responseUtils.sendJson(response, fProduct));
};

module.exports = { getAllProducts, registerProduct, updateProduct, deleteProduct, viewProduct };
