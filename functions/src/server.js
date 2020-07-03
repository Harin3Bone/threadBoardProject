//! Import Library (Express/Body-parser/Cors)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//! Initialize Firebase Admin
var admin = require("firebase-admin");

var serviceAccount = require("../asset/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://threadboardproject.firebaseio.com"
});


//! Setting Application
app.use(cors({
        origin: true
    }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: false
    }))
    .use("/", require("../controller/route"))
    .get('*', (_, res) => res.status(404)
                             .json({success:false,data:"Endpoint not found"}));

module.exports = app;                             