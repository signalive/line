global.WebSocket = require('ws'); // Polyfill for extending browser code
const Client = require('./client-web');
const request = require('request');
const Deferred = require('../lib/deferred');


/**
 * Polyfill http request for node
 */
Client.fetchResponseUrl = function(url, timeout = 3000) {
    return new Deferred({
        timeout,
        handler: (deferred) => {
            request
                .head(url, {followRedirect: false})
                .on('response', (response) => {
                    if (response.statusCode != 301 && response.statusCode != 302) {
                        return deferred.reject(new Error(`Not redirected, status code: "${response.statusCode}"`));
                    }

                    if (!response.headers.location) {
                        return deferred.reject(new Error(`Redirected, but no location header`));
                    }

                    deferred.resolve(response.headers.location);
                })
                .on('error', err => deferred.reject(err));
        }
    });
};


module.exports = Client;
