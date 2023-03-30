/**
 * *Title: not found handler.
 * ?Description: 404 not found handler.
 * @author: Faruk Sarkar
 * Date: 29/March/2023
 */

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, { message: 'not found' });
};

module.exports = handler;
