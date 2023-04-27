/**
 * *Title: server library
 * ?Description: server related files
 * @author: Faruk Sarkar
 * Date: 29/03/2023
 */

// dependencies
const http = require('http');
const environment = require('../helpers/environments');

const { handleReqRes } = require('../helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = environment;

app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port);
};

app.handleRequest = handleReqRes;

module.exports = app;
