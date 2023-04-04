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

// update data from file.
lib.update = (directory, fileName, data, callback) => {
    fs.open(`${lib.baseDir + directory}/${fileName}.json`, 'r+', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            const json = JSON.stringify(data);

            fs.writeFile(fileDescriptor, json, (error1) => {
                if (!error1) {
                    fs.close(fileDescriptor, (error2) => {
                        if (!error2) {
                            callback('file successful open');
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing a file');
                }
            });
        } else {
            callback('Error opening file');
        }
    });
};

// delete data from file.
lib.delete = (directory, fileName, callback) => {
    fs.unlink(`${lib.baseDir + directory}/${fileName}.json`, (error) => {
        if (!error) {
            callback('file successful deleting');
        } else {
            callback('Error deleting file');
        }
    });
};

module.exports = lib;
