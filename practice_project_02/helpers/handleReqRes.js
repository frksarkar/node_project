/**
 * *Title: handle request and response.
 * ?Description: handle request and response.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');

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

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
        realData += decoder.end();
        console.log(realData);
    });
    res.end('hello world');
};

module.exports = handler;
