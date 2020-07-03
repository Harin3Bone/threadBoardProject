//~ Import Router
const router = require("express").Router();

//~ Service Locate
const users = require("../services/user");
const threads = require("../services/thread");

//! API (User)
//# Add once user
router.post("/user",users.addOnceUser);

//* User Login
router.get("/user",users.getOnceUser);

//? API (Thread)
//# Add once thread
router.post("/thread",threads.addOnceThread);

//! Export
module.exports = router;