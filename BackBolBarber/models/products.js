'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema({
    productName: String,
    productDescription: String,
    productPrice: Number,
    productStock: Number
});

module.exports = mongoose.model('products', ProductSchema);
