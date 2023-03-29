/**
 * *Title: practice project node.js
 * ?Description: node.js network practice project
 * @author: Faruk Sarkar
 * Date: 29/03/2023
 */

// dependencies
const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

app.createServer = () => {
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port);
};

app.handleRequest = handleReqRes;

app.createServer();
