/**
 * *Title: Utilities
 * ?description: utilities method
 * @author: faruk sarkar
 * *Date: 06-April-2023
 */

// dependencies
const crypto = require('crypto');
const environmentToExport = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto
            .createHash('sha256', environmentToExport.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
    return false;
};

// create random token

utilities.createRandomToken = (strLength) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        let token = '';
        for (let i = 1; i < length; i += 1) {
            token += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return token;
    }
    return length;
};

// exports module
module.exports = utilities;
