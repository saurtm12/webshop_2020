const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const orderedItemSchema = new Schema({
    product: {
        // productId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Product',
        //     required: true,
        //     trim: true
        // },
        name: {
            type: String,
            minlength: 1,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            description: "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point",
            validate: function() {
                return this.product.price > 0;
            }
        }
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    }
});

const orderSchema = new Schema({
    customerId: {
        type: String,
        ref: 'User',
        required: true,
        trim: true
    },
    items: {
        type: [orderedItemSchema],
        // validate: function() { return this.items.length >= 1; },
        description: "Array of order items. Each item must have a COPY of the product information (no image) and the amount of products ordered"
    }
});

orderSchema.set('toJSON', { virtuals: false, versionKey: false });
orderedItemSchema.set('toJSON', { virtuals: false, versionKey: false});

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;