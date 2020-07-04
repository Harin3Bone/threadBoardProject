//~ Initialize Cloud Firestore
const admin = require('firebase-admin');

let db = admin.firestore();

//~ Import uuidV4
const uuid = require('uuid/v4');

//~ Another Function
const feature = require('../controller/function');

//~ Function Declaration
//? Add Once Thread
function addOnceThread(req, res) {
    //~ Input Data
    let userId = req.body.id;
    let threadTitle = req.body.title;
    let threadContent = req.body.content;
    let threadId = uuid();

    //# Generate DateTime
    let dateGenerate = new Date(Date.now());
    let threadDate = dateGenerate.toLocaleDateString();
    let threadTime = dateGenerate.toLocaleTimeString();
    let threadCreate = threadDate + "?" + threadTime;

    //~ Using Function        
    checkUserId();

    //# Check UserId is exist ?
    async function getUsernameSnapshot() {
        var userIdData = []
        var userIdSnapshot = db.collection('Users').get()
        for (const userDoc of (await userIdSnapshot).docs) {
            userIdData.push(userDoc.data().id)
        }
        return userIdData
    }

    async function checkUserId() {
        let userSnapshot = await getUsernameSnapshot();
        for (var index = 0; index < userSnapshot.length; index++) {
            //! Not Found UserId
            if (userId !== userSnapshot[index]) {
                return res.status(404).json({
                    status: 404,
                    data: "Error, Account not found"
                })
            } else {
                //* Add Thread after found userId is truly have
                addThreadData();
                break;
            }
        }
    }

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

// //? Update Once thread
function updateOnceThread(req, res) {
    //~ Input Data
    let userId = req.body.create_by;
    let threadId = req.body.id;

    //~ Edit Data
    let threadTitle = req.body.title;
    let threadContent = req.body.content;

    //# Generate DateTime
    let dateGenerate = new Date(Date.now());
    let threadDate = dateGenerate.toLocaleDateString();
    let threadTime = dateGenerate.toLocaleTimeString();
    let threadEdit = threadDate + "?" + threadTime;

    //~ Function Using
    checkThreadCreator();
    editThreadData();

    //# Get Thread Data
    function getThreadData() {
        let threadSnapshot = db.collection('Threads').doc(threadId).get();

        if (threadSnapshot != null || threadSnapshot != undefined) {
            return threadSnapshot;
        } else {
            //! Error Thread not Found
            return res.status(404).json({
                status: 404,
                data: "Error, Thread not found"
            });
        }
    }

    //# Check thread creator
    async function checkThreadCreator() {
        let threadData = await getThreadData();

        if (threadData.data().create_by !== userId) {
            return res.status(404).json({
                status: 404,
                data: "Error, You do not have permission to edit this thread"
            });
        }
    }

    //# Edit thread Data
    function editThreadData() {
        let threadRef = db.collection("Threads").doc(threadId);
        let threadOnce = threadRef
            .get()
            .then(doc => {
                if (!doc.exists) {
                    //! Thread not found -> Error
                    return res.status(404).json({
                        status: 404,
                        data: "Error, Thread not found"
                    });
                } else {
                    //* Update Thread Data
                    let threadSet = threadRef.update({
                        title: threadTitle,
                        content: threadContent,
                        edit_at: threadEdit
                    });

                    //* Update Successful
                    return res.status(201).json({
                        status: 201,
                        data: "Thread has been update successful"
                    });
                }
            })
            .catch(err => {
                return res.status(404).json({
                    status: 404,
                    data: "Error, some input was missing"
                });
            });
    }
}

//? Get All Thread
function getAllThread(req, res) {
    var allThreadData = [];

    db.collection("Threads").get()
        .then((threadSnapshot) => {
            threadSnapshot.forEach((doc) => {
                //# Get all should not able to see content (Just like Pantip,Medium)
                let threadEachData = {
                    id: doc.data().id,
                    create_by: feature.getUsernameFromId(doc.data().create_by),
                    title: doc.data().title
                }

                allThreadData.push(threadEachData);
            });

            //* Send all of thread
            return res.send(allThreadData);
        })
        .catch((error) => {
            return res.status(404).json({
                status: 404,
                data: "Error, thread not found"
            })
        });
}

//? Get Once Thread
function getOnceThread(req, res) {
    //~ Input Data
    let threadId = req.params.id;

    //# Get thread data
    let threadRef = db.collection("Threads").doc(threadId);
    let threadOnce = threadRef.get()
        .then(doc => {
            if (doc.exists) {
                //* Restrict data should view
                let threadRestrict = {
                    title: doc.data().title,
                    content: doc.data().content,
                    create_by: feature.getUsernameFromId(doc.data().create_by),
                    create_date: feature.getOnlyDate(doc.data().create_at),
                    create_time: feature.getOnlyTime(doc.data().create_at)
                }

                //* Get once thread success
                return res.send(threadRestrict);
            } else {
                return res.status(404).json({
                    status: 404,
                    data: "Error, thread not found"
                })
            }
        })
        .catch((error) => {
            return res.status(404).json({
                status: 404,
                data: "Error, thread not found" + error
            })
        });
}

//! Export
module.exports = {
    addOnceThread,
    updateOnceThread,
    getAllThread,
    getOnceThread
}