//~ Import Router
const router = require("express").Router();

//~ Service Locate
const users = require("../services/user");
const threads = require("../services/thread");

//-- API (User)
//# Add once user
router.post("/user",users.addOnceUser);

//? User Login
router.put("/user",users.userLogin);

//* User profile page
router.get("/user/:id",users.getUserProfile);

//? Edit profile
router.put("/user/:id/update",users.updatePassword);

//-- API (Thread)
//# Add once thread
router.post("/thread",threads.addOnceThread);

//? Update once thread
router.put("/thread/update",threads.updateOnceThread);

//! Export
module.exports = router;