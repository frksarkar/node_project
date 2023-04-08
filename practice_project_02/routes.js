/**
 * *Title: routes
 * ?Description: all routes defined.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

// dependencies
const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
