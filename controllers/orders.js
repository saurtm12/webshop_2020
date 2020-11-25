const responseUtils = require('../utils/responseUtils');

const getAllOrders = async response => {
    const Order = await require("../models/order");
    const orderData = await Order.find({});
    return responseUtils.sendJson(response, orderData);
}

const viewOrder = async (response, orderId) => {
    const Order = await require("../models/order");
    const order = await Order.findById(orderId).exec();
    if (!order)
    {
        return responseUtils.notFound(response);
    }
    return responseUtils.sendJson(response, order);
}

const viewOrderByCustomer = async (response, currentUser) => {
    
}
