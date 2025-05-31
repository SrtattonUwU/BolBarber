'use strict'

var express = require('express');
var citationController = require('../controllers/citations');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/citation', token.validateToken, citationController.createCitation);
routes.put('/api/citation/update/:_id', token.validateToken, citationController.editCitation);
routes.get('/api/citation/find/:_id', token.validateToken, citationController.findCitationById);
routes.delete('/api/citation/delete/:_id', token.validateToken, citationController.deleteCitation);
routes.get('/api/citation/user/:userId', token.validateToken, citationController.findCitationByUserId);

module.exports = routes;
