'use strict'

var express = require('express');
var privateCommentaryController = require('../controllers/privatecommentaries');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/privateCommentary', token.validateToken, privateCommentaryController.createPrivateCommentary);

module.exports = routes