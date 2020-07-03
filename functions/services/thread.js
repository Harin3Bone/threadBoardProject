//~ Initialize Cloud Firestore
const admin = require('firebase-admin');

let db = admin.firestore();

//~ Import uuidV4
const uuid = require('uuid/v4');

//~ Another Function
const feature = require('./other');

//~ Function Declaration
//? Add Once Thread
function addOnceThread(req, res) {
    //~ Input Data
    let userId = req.body.id;
    let threadTitle = req.body.title;
    let threadContent = req.body.content;
    let threadId = uuid() + "&" + threadTitle;

    //# Generate DateTime
    let dateGenerate = new Date(Date.now());
    let threadDate = dateGenerate.toLocaleDateString();
    let threadTime = dateGenerate.toLocaleTimeString();
    let threadCreate = threadDate + "?" +threadTime;

    //~ Using Function
    addThreadData();    
    
    //* Success
    function addThreadData(){
        res.status(200)
        .json({
            id: threadId,
            title: threadTitle,
            content: threadContent,
            create_at: threadCreate,
            by: userId
        })
    }
}

//! Export
module.exports = {
    addOnceThread
}