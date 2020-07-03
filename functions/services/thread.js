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
    let threadCreate = threadDate + "?" + threadTime;

    //~ Using Function
    addThreadData();

    //* Success
    function addThreadData() {
        let threadRef = db.collection("Threads").doc(threadId);
        let threadOnce = threadRef
            .get()
            .then(doc => {
                if (!doc.exists) {
                    let threadSet = db.collection("Threads").doc(threadId);

                    let threadSetData = threadSet.set({
                        id: threadId,
                        title: threadTitle,
                        content: threadContent,
                        create_at: threadCreate,
                        create_by: userId
                    });

                    //* Create Thread Success
                    return res.status(201).json({
                        status: 201,
                        data: "Thread create successful"
                    });
                } else {
                    addOnceNews(req, res);
                }
            })
            .catch(err => {
                return res.status(404).json({
                    status: 404,
                    data: "Error, endpoint not found"
                });
            });
    }
}

//? Update Once thread
function updateOnceThread(req,res){
    let userId = req.body.create_by;
    let threadId = req.body.id;    

    return res.send(threadId + "||" + userId);
}

//! Export
module.exports = {
    addOnceThread,
    updateOnceThread
}