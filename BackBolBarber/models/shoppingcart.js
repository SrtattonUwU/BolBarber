'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShoppingCartSchema = Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    productsList: Array,
    status: Boolean
});

module.exports = mongoose.model('shoppingcart', ShoppingCartSchema);
