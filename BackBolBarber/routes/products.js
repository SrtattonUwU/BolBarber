'use strict'

var express = require('express');
var productController = require('../controllers/products');
var routes = express.Router();
var token = require('../helpers/auth');

routes.post('/api/product', token.validateToken, productController.createProduct);
routes.put('/api/product/edit/:_id', token.validateToken, productController.editProduct);
routes.get('/api/product/find', token.validateToken, productController.findAllProducts);
routes.delete('/api/product/delete/:_id', token.validateToken, productController.deleteProduct);

module.exports = routes