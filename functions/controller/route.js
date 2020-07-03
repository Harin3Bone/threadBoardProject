//~ Import Router
const router = require("express").Router();

//~ Service Locate
const users = require("../services/user");

//! API 
//# Add once user
router.post("/user",users.addOnceUser);

//? User Login
router.get("/user",users.getOnceUser);

//! Export
module.exports = router;