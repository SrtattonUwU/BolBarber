'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PrivateCommentSchema = Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    firstName: String,
    lastName: String,
    email: String,
    text: String
});

module.exports = mongoose.model('privateCommentaries', PrivateCommentSchema);