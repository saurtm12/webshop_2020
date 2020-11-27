const { interfaces } = require('mocha');
const responseUtils = require('../utils/responseUtils');

/**
 * get all orders and send json (with admin)
 *
 * @param {object} response http.ServerResponse
 * @returns {object} all orders
 */
const getAllOrders = async response => {
    const Order = await require("../models/order");
    const orderData = await Order.find({});
    return responseUtils.sendJson(response, orderData);
};

/**
 * view an order with admin
 *
 * @param {object} response http.ServerResponse
 * @param {string} orderId ID of the order
 * @returns {object} response?
 */
const viewOrder = async (response, orderId) => {
    const Order = await require("../models/order");
    const order = await Order.findById(orderId).exec();
    if (!order) {
        return responseUtils.notFound(response);
    }

    return responseUtils.sendJson(response, order);
};

/**
 * Register orders of a customer
 *
 * @param {object} response http.ServerResponse
 * @param {string} cId : customer Id, assume that cId has been in our database
 * @returns {object} response
 */
const viewOrdersByCustomer = async (response, cId) => {
    const Order = await require("../models/order");
    const orderData = await Order.find({customerId : cId});
    return responseUtils.sendJson(response, orderData);
};

/**
 * Register new order and send back as JSON
 *
 * @param {object} response http.ServerResponse
 * @param {object} orderData JSON data from request body
 * @param {string} cId : customer Id, assume that cId has been in our database
 * @returns {object} response
 */
const registerOrder = async (response, orderData, cId) => {
    console.log(orderData);
    console.log(orderData.items);
    console.log('QUANTITY:', orderData.items);
    
    if (!orderData){
        return responseUtils.badRequest(response, "Body order is empty");
    }
    
    if (orderData.items.length < 1){
        return responseUtils.badRequest(response, "Order is empty");
    }
    const wrongData = orderData.items.find(item => !item.quantity || !item.product || (item.product && !item.product._id) ||(item.product && !item.product.price) || (item.product && !item.product.name));
    if (wrongData) {
        return responseUtils.badRequest(response, "Product/Quantity/Product id is missing");
    }
    const Order = await require("../models/order");

    const newOrder = new Order({customerId : orderData.items[0].product["_id"], ...orderData});
    // await newOrder.validate();
    const test = await newOrder.save();
    console.log(test);
    //const returnedOrder = {customerId: orderData.items[0].product["_id"], ...newOrder}
    return responseUtils.createdResource(response, newOrder);
};

const viewOrderByCustomer = async (response, orderId, cId) => {
    const Order = await require("../models/order");
    const fOrder = await Order.findById(orderId).exec();
    if (!fOrder){
        return responseUtils.notFound(response);
    }
    if (fOrder.customerId !== cId){
        return responseUtils.notFound(response);
    }
    return responseUtils.sendJson(response, fOrder);
};
module.exports = {getAllOrders, viewOrder, viewOrdersByCustomer, viewOrderByCustomer, registerOrder};