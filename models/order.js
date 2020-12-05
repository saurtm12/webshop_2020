const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

const orderedItemSchema = new Schema({
    product : {
        _id : { 
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true,
            trim : true
        },
        name : {
            type : String, 
            minlength : 1, 
            required : true,
            trim : true
        },
        description : {
            type : String, 
            trim : true
          },
        price : {
            type : mongoose.Types.Decimal128,
            required : true,
            description : "price of one product in Euros, without the Euro sign (€). Euros and cents are in the same float, with cents coming after the decimal point",
            validate : function() {return this.product.price > 0;}
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
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require: true,
        trim : true
    },
    items: {
        type: [orderedItemSchema],
        // validate: function() { return this.items.length >= 1; },
        description: "Array of order items. Each item must have a COPY of the product information (no image) and the amount of products ordered"
    }
});

orderSchema.set('toJSON', { virtuals: false, versionKey: false});
orderedItemSchema.set('toJSON', { virtuals: false, versionKey: false});
orderedItemSchema.set('autoIndex', false);
orderSchema.set('autoIndex', false);

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;