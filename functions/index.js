//~ Import Firebase Function
const functions = require('firebase-functions');

//~ Server Location
const server = require('./src/server');
const api = functions
            .runWith({memory: "2GB", timeoutSeconds: 120})
            .https
            .onRequest(server);

module.exports = {
    api
};
