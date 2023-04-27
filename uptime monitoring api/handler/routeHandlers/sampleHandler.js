/**
 * *Title: sample handler
 * ?Description: sample handler.
 * @author: Faruk Sarkar
 * *Date: 29/March/2023
 */

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, { message: 'sample handler' });
};

module.exports = handler;
