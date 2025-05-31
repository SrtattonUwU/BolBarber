'use strict'

var express = require('express');
var commentaryController = require('../controllers/commentaries');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/commentary', token.validateToken, commentaryController.createCommentary);
routes.put('/api/commentary/edit/:_id', token.validateToken, commentaryController.editCommentary);
routes.get('/api/commentary/find', token.validateToken, commentaryController.findAllCommentary);
routes.delete('/api/commentary/delete/:_id', token.validateToken, commentaryController.deleteCommentary);

module.exports = routes