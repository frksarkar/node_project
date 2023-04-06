/**
 * *Title: Utilities
 * ?description: utilities method
 * @author: faruk sarkar
 * *Date: 06-April-2023
 */

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

// exports module
module.exports = utilities;
