//~ Import Router
const router = require("express").Router();

//~ Service Locate
const users = require("../services/user");
const threads = require("../services/thread");

//-- API (User)
//# Add once user    
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/user
router.post("/user",users.addOnceUser);

//? User Login      
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/user
router.put("/user",users.userLogin);

//* User profile page
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/(userId)
router.get("/user/:id",users.getUserProfile);

//? Edit profile
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/(userId)/update
router.put("/user/:id/update",users.updatePassword);

//-- API (Thread)
//# Add once thread
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/thread
router.post("/thread",threads.addOnceThread);

//? Update once thread
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/thread/update
router.put("/thread/update",threads.updateOnceThread);

//* Get all thread
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/thread
router.get("/thread",threads.getAllThread);

//* Get once thread
//~ https://us-central1-threadboardproject.cloudfunctions.net/api/thread/(threadId)
router.get("/thread/:id",threads.getOnceThread);

//! Export
module.exports = router;