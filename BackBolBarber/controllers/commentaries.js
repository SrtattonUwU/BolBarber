'use strict'

var Commentary = require('../models/commentaries');

function createCommentary(req, resp) {
    var commentaryRequestBody = req.body;
    var newCommentary = new Commentary();

    newCommentary.userId = commentaryRequestBody.userId;
    newCommentary.text = commentaryRequestBody.text;
    newCommentary.date = Date.now();

    if (
        newCommentary.userId === null || newCommentary.text === null
        || newCommentary.text.trim() === ''
    ) {
            resp.status(400).send({'message': 'One or more required variables were not sent'});
    }

    newCommentary.save().then(
        (savedCommentary) => {
            resp.status(200).send({'message': 'Commentary was created succesfully', 'commentary': savedCommentary});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while creating the commentary', 'error': err});
        }
    );
}

function editCommentary(req,resp){
    var commentaryToEdit = req.params._id;
    var newCommentaryToEdit = req.body;
    var commentary = new Commentary();

    commentary._id = commentaryToEdit;
    commentary.text = newCommentaryToEdit.text;
    commentary.date = Date.now();

    Commentary.findByIdAndUpdate(commentary._id, commentary, {new:true}).then(
        (updatedCommentary)=>{
            resp.status(200).send({'message': 'Commentary updated', 'commentary': updatedCommentary});
        },
        (err)=>{
            resp.status(500).send({'message': 'An error ocurred while editing the commentary', 'error': err});
        }
    );
}


function findAllCommentary(req, resp) {
    Commentary.find()
        .then(foundCommentary => resp.status(200).send({'Commentaries': foundCommentary}))
        .catch(err => resp.status(500).send({'message': 'An error occurred while searching the commentaries', 'error': err}));
}

function deleteCommentary(req, resp) {
    var commentaryToDelete = req.params._id;

    if (req.user.role === "Administrator"){
        Commentary.findByIdAndDelete(commentaryToDelete).then(
            (deletedComment) => {
                resp.status(200).send({'message': 'Commentary was deleted succesfully', 'product': deletedComment});
            },
            err => {
                resp.status(500).send({'message': 'An error ocurred while deleting the product', 'error': err});
            }
        ); 
    } else {
        resp.status(500).send({'message': 'Only administrators can delete a commentary'});
    }
}

module.exports = {
    createCommentary, editCommentary, findAllCommentary, deleteCommentary
};