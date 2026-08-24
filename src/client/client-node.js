global.WebSocket = require('ws'); // Polyfill for extending browser code
const http = require('http');
const https = require('https');
const Client = require('./client-web');
const Deferred = require('../lib/deferred');


/**
 * Polyfill http request for node
 */
Client.fetchResponseUrl = function(url, timeout = 3000) {
    let req;

    return new Deferred({
        timeout,
        onExpire: () => req && req.destroy(),
        handler: (deferred) => {
            const transport = new URL(url).protocol == 'https:' ? https : http;

            req = transport.request(url, {method: 'HEAD'}, (response) => {
                response.resume();

                if (response.statusCode != 301 && response.statusCode != 302) {
                    return deferred.reject(new Error(`Not redirected, status code: "${response.statusCode}"`));
                }

                if (!response.headers.location) {
                    return deferred.reject(new Error(`Redirected, but no location header`));
                }

                deferred.resolve(response.headers.location);
            });

            req.on('error', err => deferred.reject(err));
            req.end();
        }
    });
};


module.exports = Client;
