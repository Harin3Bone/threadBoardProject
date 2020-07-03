//~ Initialize Cloud Firestore
const admin = require('firebase-admin');

let db = admin.firestore();

//~ Import uuidV4
const uuid = require('uuid/v4');

//~ Function Declaration
//? Add once user
function addOnceUser(req, res) {
    //# Input data
    let userName = req.body.username;
    let userId = uuid() + "|" + userName;
    let userPassword = req.body.password;
    let userEmail = req.body.email;

    //* Add User Success -> Registration Complete
    return res.status(201)
        .json({
            id: userId,
            name: userName,
            password: userPassword,
            email: userEmail
        });
}

//! Export 
module.exports = {
    addOnceUser
}