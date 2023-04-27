/**
 * *Title: routes
 * ?Description: all routes defined.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

// dependencies
const { sampleHandler } = require('./handler/routeHandlers/sampleHandler');
const { userHandler } = require('./handler/routeHandlers/userHandler');
const { tokenHandler } = require('./handler/routeHandlers/tokenHandler');
const { checkHandler } = require('./handler/routeHandlers/checkHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
