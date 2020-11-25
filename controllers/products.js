/**
 * Send all products as JSON
 *
 * @param {object} response http.ServerResponse
 * @returns {object} response
 */
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
  if (productData.price <= 0){
      return responseUtils.badRequest(response, "Invalid price");
  }
  const pattern = "(http|https):\/\/\S+\.\S+\/?\S*";
  const regex = new RegExp(pattern);
  if (!regex.test(userData.email))
  {
    return responseUtils.badRequest(response, "Image resource is not valid");
  }
  const Product = await require('../models/product');
  const newProduct = new Product({
    name: productData.name,
    description: productData.description,
    price: productData.price
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
  const Product = await require('../models/product');
  const fProduct = await Product.findById(productId).exec();

  if (!fProduct){
    return responseUtils.notFound(response);
  }

  if (productData.price <= 0){
    return responseUtils.badRequest(response, "Invalid price");
  }
  Object.entries(productData).forEach((key, value) => {
    fProduct[key] = value;
  });
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

module.exports = { getAllProducts, registerProduct, updateProduct, deleteProduct};
