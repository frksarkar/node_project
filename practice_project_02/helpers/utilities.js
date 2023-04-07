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

// exports module
module.exports = utilities;
