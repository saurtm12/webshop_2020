/**
 * Send all products as JSON
 *
 * @param {http.ServerResponse} response
 */
const responseUtils = require('../utils/responseUtils');
const { sendJson } = require('../utils/responseUtils');

const getAllProducts = async response => {
  const productData = await require('../products.json').map(product => ({ ...product }));
  sendJson(response, productData);
};

/**
 * Register new product and send created product back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} productData JSON data from request boy
 * @param {Object} currentUser moongoose document object
 */
const registerProduct = async (response, productData, currentUser) =>{
  if (! currentUser){
    return responseUtils.basicAuthChallenge(response);
  }
  if (currentUser.role !== "admin"){
    return responseUtils.forbidden(response);
  }
  if (productData.price <= 0){
      return responseUtils.badRequest(response, "Invalid price");
  }
  const Product = await require('../models/product');
  const newProduct = new Product({
    name: productData.name,
    description: productData.description,
    price: productData.price
  });
  await newProduct.save();
  return responseUtils.createdResource(response, newProduct);
}


/**
 * Send product data as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} productId 
 * @param {Object} currentUser moongoose document object
 */
const viewProduct = async (response, productId, currentUser) => {
  if (! currentUser){
    return responseUtils.basicAuthChallenge(response);
  }
  const Product = await require('../models/product');
  const vProduct = await Product.findById(productId).exec();
  if (!vProduct){
    return responseUtils.notFound(response);
  }
  else{
    return responseUtils.sendJson(response, vProduct);
  }
}

/**
 * Update product and send updated product as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} productId 
 * @param {Object} currentUser moongoose document object
 * @param {Object} productData JSON data from request body
 */
const updateProduct = async (response, productId, currentUser, productData) => {
  if (!currentUser){
    return responseUtils.basicAuthChallenge(response);
  }

  if (!currentUser.role || currentUser.role !== "admin"){
    return responseUtils.badRequest(response, "Bad request");
  }
  const Product = await require('../models/product');
  const fProduct = await Product.findById(productId).exec();

  if (!fProduct){
    return responseUtils.notFound(response);
  }
  else{
    Object.entries(productData).forEach((key, value) => {
      fProduct[key] = value;
    });
    await fProduct.save();
    return responseUtils.sendJson(response, fProduct);
  }
}


const deleteProduct = async (response, productId, currentUser) => {
  if (currentUser.role !== "admin"){
    return responseUtils.badRequest(reponse, "Bad request");
  }
  const Product = await require('../models/product');
  const fProduct = await Product.findById(productId).exec();
  if (!fProduct){
    return responseUtils.notFound(response);
  }
  await Product.deleteOne({_id: productId}).then(() => 
  responseUtils.sendJson(response, fProduct));
}
module.exports = { getAllProducts };
