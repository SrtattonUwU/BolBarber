'use strict'

var express = require('express');
var userController = require('../controllers/users')
var routes = express.Router();
var token = require('../helpers/auth');

routes.post('/api/user', userController.createUser);
routes.post('/api/login', userController.loginUser);
routes.put('/api/userEdit/:_id', token.validateToken, userController.editUser);
routes.get('/api/find', userController.findAllUsers);
routes.delete('/api/user/delete/:_id', token.validateToken, userController.deleteUser);
routes.get('/api/barbers', userController.getBarbers);

module.exports = routes;
