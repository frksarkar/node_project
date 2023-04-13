/**
 * *Title: User Handler
 * ?description: Handler handle to user related route
 * @author: faruk sarkar
 * *Date: 04-April-2023
 */

// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        console.log(requestProperties.method);
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    // body is user object server side
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    // const email = typeof requestProperties.body.email === 'string';
    // requestProperties.body.email.trim().length > 0 ? requestProperties.body.email : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean'
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', 'phone', (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                data.create('users', phone, userObject, (err1) => {
                    if (!err1) {
                        callback(200, { message: 'user was created successfully' });
                    } else {
                        callback(500, { message: "couldn't create user! already excises" });
                    }
                });
            } else {
                callback(500, { message: 'file already excises' });
            }
        });
    } else {
        callback(400, {
            message: 'bad request',
        });
    }
};

handler._user.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        //
        data.read('users', phone, (u) => {
            const user = { ...parseJSON(u) };
            if (user) {
                delete user.password;
                console.log(user);
                callback(200, user);
            } else {
                callback(404, { message: 'user was not found' });
            }
        });
    } else {
        callback(404, { message: 'request user not found' });
    }
};

handler._user.put = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    if (phone && (firstName || lastName || password)) {
        data.read('users', phone, (user) => {
            if (user) {
                const userData = { ...parseJSON(user) };

                if (firstName) {
                    userData.firstName = firstName;
                }
                if (lastName) {
                    userData.lastName = lastName;
                }
                if (password) {
                    userData.password = hash(password);
                }

                data.update('users', phone, userData, (err) => {
                    if (err) {
                        callback(200, { message: 'user update successfully' });
                    }
                });
            } else {
                callback(400, { message: 'there was a problem server-side' });
            }
        });
    } else {
        callback(400, { message: 'there was a problem server-side authentication' });
    }
};

handler._user.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        data.read('users', phone, () => {
            data.delete('users', phone, (message) => {
                callback(200, { message });
            });
        });
    } else {
        callback(400, { message: 'there was a problem in you request' });
    }
};

module.exports = handler;
