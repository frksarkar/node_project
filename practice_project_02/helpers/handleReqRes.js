/**
 * *Title: handle request and response.
 * ?Description: handle request and response.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const { notFoundHandler } = require('../handler/routeHandlers/notFoundHandler');
const routes = require('../routes');

// handle Object - module scaffolding.
const handler = {};

handler.handleReqRes = (req, res) => {
    //
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    chosenHandler(requestProperties, (statusCode, payload) => {
        // eslint-disable-next-line no-param-reassign
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        // eslint-disable-next-line no-param-reassign
        payload = typeof payload === 'object' ? payload : {};

        const jsonString = JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(jsonString);
    });

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
    });
};

module.exports = handler;
