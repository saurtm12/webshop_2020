const responseUtils = require('../utils/responseUtils');

/**
 * get all orders and send json (with admin)
 *
 * @param {http.ServerResponse} response
 */
const getAllOrders = async response => {
    const Order = await require("../models/order");
    const orderData = await Order.find({});
    return responseUtils.sendJson(response, orderData);
}

/**
 * view an order with admin
 *
 * @param {http.ServerResponse} response
 * @param orderId
 */
const viewOrder = async (response, orderId) => {
    const Order = await require("../models/order");
    const order = await Order.findById(orderId).exec();
    if (!order)
    {
        return responseUtils.notFound(response);
    }
    return responseUtils.sendJson(response, order);
}

/**
 * Register orders of a customer
 *
 * @param {http.ServerResponse} response
 * @param cId : customer Id, assume that cId has been in our database
 */
const viewOrdersByCustomer = async (response, cId) => {
    const Order = await require("../models/order");
    const orderData = await Order.find({customerId : cId}).exec();
    return responseUtils.sendJson(response, orderData);
}

/**
 * Register new order and send back as JSON
 *
 * @param {http.ServerResponse} response
 * @param {Object} orderData JSON data from request body
 * @param cId : customer Id, assume that cId has been in our database
 */
const registerOrder = async (resonse, orderData, cId) => {
    if (!orderData){
        responseUtils.badRequest(response, "Body order is empty");
    }
    if (orderData["items"].length <1){
        responseUtils.badRequest(response, "Order is empty");
    }
    const Order = await require("../models/order");

    const newOrder = new Order({customerId: cId,
                                items: orderData});
    await newOrder.validate();
    await newOrder.save();
    return responseUtils.createdResource(response, newOrder);
}

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
} 
module.exports = {getAllOrders, viewOrder, viewOrdersByCustomer, viewOrderByCustomer, registerOrder};