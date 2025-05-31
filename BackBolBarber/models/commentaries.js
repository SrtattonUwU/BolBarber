'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    text: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('commentaries', CommentSchema);