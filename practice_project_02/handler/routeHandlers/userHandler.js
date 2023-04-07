/**
 * *Title: User Handler
 * ?description: Handler handle to user related route
 * @author: faruk sarkar
 * *Date: 04-April-2023
 */

// dependencies
const { hash } = require('../../helpers/utilities');
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
    // body is user object
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
        // todo
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

handler._user.get = (requestProperties, callback) => {};

handler._user.put = (requestProperties, callback) => {};

handler._user.delete = (requestProperties, callback) => {};

module.exports = handler;