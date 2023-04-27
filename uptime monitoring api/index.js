/**
 * *Title: Project Initial file
 * ?description: Initial file to start the node server and workers
 * @author: Faruk Sarkar
 * *Date: 27-April-2023
 */

// dependencies
const { createServer } = require('./lib/server');

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    createServer();
    // start the workers
};
