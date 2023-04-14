/**
 * *Title: token handler
 * ?description: handler to handle the token
 * @author: faruk sarkar
 * *Date: 13-April-2023
 */

// dependencies
const { hash, parseJSON, createRandomToken } = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        console.log(requestProperties.method);
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
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

    if (password && phone) {
        const hashedPassword = hash(password);
        data.read('users', phone, (userData) => {
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomToken(20);
                const expire = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    id: tokenId,
                    expire,
                    phone,
                };

                // store the token object
                data.create('tokens', tokenId, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, 'there was a problem server-side');
                    }
                });
            } else {
                callback(400, { error: 'password invalid' });
            }
        });
    } else {
        callback(400, { error: 'you have a problem in your request' });
    }
};

handler._token.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        //
        data.read('tokens', id, (userToken) => {
            const token = { ...parseJSON(userToken) };
            if (token) {
                callback(200, token);
            } else {
                callback(404, { message: 'token was not found' });
            }
        });
    } else {
        callback(404, { message: 'request token not found' });
    }
};

handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );

    if (id && extend) {
        //
        data.read('tokens', id, (userToken) => {
            const token = { ...parseJSON(userToken) };
            if (token.expire > Date.now()) {
                token.expire = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, token, (err) => {
                    if (err) {
                        callback(200, { message: 'file updated successfully' });
                    } else {
                        callback(500, { error: 'there was an error updating' });
                    }
                });
            } else {
                callback(400, { error: 'token already expired' });
            }
        });
    } else {
        callback(400, { error: 'there was a problem in your request' });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        data.read('tokens', id, () => {
            data.delete('tokens', id, (message) => {
                callback(200, { message });
            });
        });
    } else {
        callback(400, { message: 'there was a problem in you request' });
    }
};

// token verify
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (tokenData) => {
        if (tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expire > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
