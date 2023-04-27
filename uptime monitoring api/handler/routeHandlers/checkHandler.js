/**
 * *Title: check handler
 * ?description: Handler to handle user defined checks
 * @author: faruk sarkar
 * *Date: 17-April-2023
 */

// dependencies
const { parseJSON, createRandomToken } = require('../../helpers/utilities');
const data = require('../../lib/data');
const {
    _token: { verify },
} = require('./tokenHandler');

// module scaffolding
const handler = {};
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        console.log(requestProperties.method);
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // body is user object server side
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds > 1 &&
        requestProperties.body.timeoutSeconds < 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;
        // lookup the uer phone
        data.read('tokens', token, (tokenData) => {
            if (tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                data.read('users', userPhone, (userData) => {
                    if (userData) {
                        verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObject = parseJSON(userData);
                                const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length < 5) {
                                    const checkId = createRandomToken(20);
                                    const checkObject = {
                                        checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if (!err) {
                                            // add check id to the user object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err2) => {
                                                if (err2) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, { error: 'there was an error ' });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'there was a problem in the server-side',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'user has already reached max checks limit',
                                    });
                                }
                            } else {
                                callback(403, { error: 'authentication error' });
                            }
                        });
                    } else {
                        callback(403, { error: 'User not found' });
                    }
                });
            } else {
                callback(403, { error: 'authentication failed' });
            }
        });
    } else {
        callback(400, {
            message: 'You have a problem in your request',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
    const checkId =
        typeof requestProperties.queryStringObject.checkId === 'string' &&
        requestProperties.queryStringObject.checkId.trim().length === 20
            ? requestProperties.queryStringObject.checkId
            : false;

    if (checkId) {
        //

        data.read('checks', checkId, (checkData) => {
            const cData = parseJSON(checkData);
            if (checkData) {
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;
                verify(token, cData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, cData);
                    } else {
                        callback(403, { error: 'authentication failed' });
                    }
                });
            } else {
                callback(400, { error: 'You have a problem in your request' });
            }
        });
    } else {
        callback(404, { message: 'request id not found' });
    }
};

handler._check.put = (requestProperties, callback) => {
    const checkId =
        typeof requestProperties.body.checkId === 'string' &&
        requestProperties.body.checkId.trim().length === 20
            ? requestProperties.body.checkId
            : false;

    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;
    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds > 1 &&
        requestProperties.body.timeoutSeconds < 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (checkId) {
        if (protocol || url || successCodes || method || timeoutSeconds) {
            data.read('checks', checkId, (check) => {
                if (check) {
                    const checkData = { ...parseJSON(check) };
                    // token verify start
                    const token =
                        typeof requestProperties.headersObject.token === 'string'
                            ? requestProperties.headersObject.token
                            : false;

                    // verify function
                    verify(token, checkData.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            data.update('checks', checkId, checkData, (err) => {
                                if (err) {
                                    callback(200, { message: 'user update successfully' });
                                } else {
                                    callback(500, { message: 'there was a server side error' });
                                }
                            });
                        } else {
                            callback(403, { error: 'authentication failed' });
                        }
                    });
                    // token verify end
                } else {
                    callback(400, { message: 'there was a problem in the server-side' });
                }
            });
        } else {
            callback(400, { error: 'You mast provide at last one field to update' });
        }
    } else {
        callback(400, { message: 'You have a problem in your request' });
    }
};

handler._check.delete = (requestProperties, callback) => {
    const checkId =
        typeof requestProperties.queryStringObject.checkId === 'string' &&
        requestProperties.queryStringObject.checkId.trim().length === 20
            ? requestProperties.queryStringObject.checkId
            : false;

    if (checkId) {
        //

        data.read('checks', checkId, (checkData) => {
            const cData = parseJSON(checkData);
            if (checkData) {
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;
                verify(token, cData.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        data.delete('checks', checkId, () => {
                            data.read('users', cData.userPhone, (uData) => {
                                const userData = parseJSON(uData);
                                if (uData) {
                                    const userChecks =
                                        typeof userData.checks === 'object' &&
                                        userData.checks instanceof Array
                                            ? userData.checks
                                            : [];

                                    // remove the deleted checks id from user's list of checks
                                    const checkPosition = userChecks.indexOf(checkId);
                                    if (checkPosition > -1) {
                                        userChecks.splice(checkPosition, 1);

                                        userData.checks = userChecks;
                                        data.update('users', userData.phone, userData, (err) => {
                                            if (err) {
                                                callback(200);
                                            } else {
                                                callback(500, {
                                                    error: 'there was a server side problem',
                                                });
                                            }
                                        });
                                    } else {
                                        callback(500, {
                                            error: 'the check id that you are trying to remove is not found in user!',
                                        });
                                    }
                                } else {
                                    callback(500, { message: 'there was a problem server side' });
                                }
                            });
                        });
                    } else {
                        callback(403, { error: 'authentication failed' });
                    }
                });
            } else {
                callback(400, { error: 'You have a problem in your request' });
            }
        });
    } else {
        callback(404, { message: 'request id not found' });
    }
};

module.exports = handler;
