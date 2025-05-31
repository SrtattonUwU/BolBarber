'use strict'

var PrivateCommentary = require('../models/privatecommentaries');

function createPrivateCommentary(req, resp) {
    var privateCommentaryRequestBody = req.body;
    var newPrivateCommentary = new PrivateCommentary();

    newPrivateCommentary.userId = privateCommentaryRequestBody.userId;
    newPrivateCommentary.firstName = privateCommentaryRequestBody.firstName;
    newPrivateCommentary.lastName = privateCommentaryRequestBody.lastName;
    newPrivateCommentary.email = privateCommentaryRequestBody.email;
    newPrivateCommentary.text = privateCommentaryRequestBody.text;

    if (
        newPrivateCommentary.userId === null ||
        newPrivateCommentary.firstName === null   ||
        newPrivateCommentary.firstName.trim() === '' ||
        newPrivateCommentary.lastName === null   ||
        newPrivateCommentary.lastName.trim() === '' ||
        newPrivateCommentary.email === null   ||
        newPrivateCommentary.email.trim() === '' ||
        newPrivateCommentary.text === null   ||
        newPrivateCommentary.text.trim() === ''
    ) {
            resp.status(400).send({'message': 'One or more required variables were not sent'});
    }

    newPrivateCommentary.save().then(
        (savedPrivateCommentary) => {
            resp.status(200).send({'message': 'Private commentary was sent succesfully', 'private commentary': savedPrivateCommentary});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while sending the private commentary', 'error': err});
        }
    );
}

module.exports = {
    createPrivateCommentary
}