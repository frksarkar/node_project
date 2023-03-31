/**
 * *Title: library
 * ?Description: all data libraries.
 * @author: Faruk Sarkar
 * Date: 31/March/2023
 */
// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory
lib.baseDir = path.join(__dirname, '../.data/');

// write data files
lib.create = (directory, fileName, data, callback) => {
    fs.open(`${lib.baseDir + directory}/${fileName}.json`, 'wx', (error, fileDescriptor) => {
        console.log(fileDescriptor);
        if (!error && fileDescriptor) {
            // convert data to json format.
            const stringData = JSON.stringify(data);

            // write data to file and then close the file.
            fs.writeFile(fileDescriptor, stringData, (error1) => {
                if (!error1) {
                    fs.close(fileDescriptor, (error2) => {
                        if (!error2) {
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing to the new file');
                }
            });
        } else {
            callback("Couldn't create data file, it was already created.");
        }
    });
};

// read data from file.
lib.read = (directory, fileName, callback) => {
    fs.readFile(`${lib.baseDir + directory}/${fileName}.json`, 'utf-8', (error, data) => {
        if (!error) {
            // empty
            callback(data);
        } else {
            callback(error);
        }
    });
};

module.exports = lib;
