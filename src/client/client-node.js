global.WebSocket = require('ws'); // Polyfill for extending browser code
const Client = require('./client-web');
const Deferred = require('../lib/deferred');


/**
 * Polyfill http request for node
 */
Client.fetchResponseUrl = function(url, timeout = 3000) {
    return new Deferred({
        timeout,
        handler: (deferred) => {
            deferred.resolve({});
        }
    });
};


module.exports = Client;
