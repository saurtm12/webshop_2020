const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true,
        trim: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 150,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate: function() {
            return this.price > 0;
        }
    },
    img: {
        type: Buffer,
        contentType: String
    }
});

// Omit the version key when serialized to JSON
productSchema.set('toJSON', {virtuals: false, versionKey: false});
const Product = new mongoose.model('Product',productSchema);
module.exports = Product;