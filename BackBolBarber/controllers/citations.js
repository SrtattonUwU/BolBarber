'use strict'

var Citation = require('../models/citations');

function createCitation(req, resp) {
    var citationRequestBody = req.body;
    var newCitation = new Citation();

    newCitation.userId = citationRequestBody.userId;
    newCitation.barberId = citationRequestBody.barberId;
    newCitation.date = new Date(citationRequestBody.date);

    if (
        newCitation.userId === null || newCitation.barberId === null
        || newCitation.date === null
    ) {
            resp.status(400).send({'message': 'One or more required variables were not sent'});
    }

    const start = new Date(newCitation.date.getTime() - 60 * 60 * 1000);
    const end = new Date(newCitation.date.getTime() + 60 * 60 * 1000);

    Citation.findOne({
        barberId: newCitation.barberId,
        date: { $gte: start, $lt: end }
    }).then(existingCitation =>{
        if (existingCitation) {
            return resp.status(400).send({
                'message': 'This barber already has a reservation in this time slot (1 hour blocked).'
            });
        }

        newCitation.save().then(
        (savedCitation) => {
            resp.status(200).send({'message': 'Citation was created succesfully', 'citation': savedCitation});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while creating the citation', 'error': err});
        }
    );

    }).catch(err => {
        resp.status(500).send({'message': 'Error checking existing citation', 'error': err});
    });

    
}

function editCitation(req,resp){
    var idCitation = req.params._id;
    var newCitationData = req.body;

    var newDate = new Date(newCitationData.date);
    var barberId = newCitationData.barberId;

    const start = new Date(newDate.getTime() - 60 * 60 * 1000);
    const end = new Date(newDate.getTime() + 60 * 60 * 1000);

    var citation = new Citation();

    citation._id = idCitation;
    citation.userId = newCitationData.userId;
    citation.barberId = newCitationData.barberId;
    citation.date = new Date(newCitationData.date);

    Citation.findOne({
        barberId: barberId,
        date: { $gte: start, $lt: end },
        _id: { $ne: idCitation }
    }).then(existingCitation => {
        if (existingCitation) {
            return resp.status(400).send({
                message: 'This barber already has a reservation in the requested time slot (1 hour before and after are blocked).'
            });
        }

        Citation.findByIdAndUpdate(idCitation, newCitationData, { new: true }).then(
            updatedCitation => {
                resp.status(200).send({ message: 'Citation updated successfully', citation: updatedCitation });
            },
            err => {
                resp.status(500).send({ message: 'Error updating the citation', error: err });
            }
        );

    }).catch(err => {
        resp.status(500).send({ message: 'Error checking existing citations', error: err });
    });
}

function findCitationById(req, resp) {
    var citationToFind = req.params._id;

    Citation.findById(citationToFind).then(
        (foundCitation) => {
            resp.status(200).send({'citation': foundCitation});
        },
        (err) => {
            resp.status(500).send({'message': 'An error ocurred while searching the citation', 'error': err});
        }
    );
}

function findCitationByUserId(req, resp) {
    const userId = req.params.userId;

    Citation.find({ userId: userId }).then(
        (citations) => {
            resp.status(200).send({'citations': citations});
        },
        (err) => {
            resp.status(500).send({'message': 'Error retrieving citations for this user', 'error': err});
        }
    );
}

function deleteCitation(req, resp) {
    var citationToDelete = req.params._id;

    Citation.findByIdAndDelete(citationToDelete).then(
        (deletedCitation) => {
            resp.status(200).send({'message': 'Citation was deleted succesfully', 'citation': deletedCitation});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while deleting the citation', 'error': err});
        }
    );
}

module.exports = {
    createCitation, deleteCitation, editCitation, findCitationById, findCitationByUserId
}