/**
 * *Title: routes
 * ?Description: all routes defined.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

// dependencies
const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');

const routes = {
    sample: sampleHandler,
};

module.exports = routes;
