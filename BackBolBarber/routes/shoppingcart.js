'use strict'

var express = require('express');
var shoppingcartController = require('../controllers/shoppingcart');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/shoppingcart/add', token.validateToken, shoppingcartController.addProduct);

module.exports = routes;
