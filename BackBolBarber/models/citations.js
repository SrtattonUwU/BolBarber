'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CitationSchema = Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    barberId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    date: Date
});

module.exports = mongoose.model('citations', CitationSchema);