const forEach = require('lodash/forEach');
const clone = require('lodash/clone');
const Message = require('../lib/message');
const debug = require('debug')('line:server:room');
const LineError = require('../lib/error');


/**
 * Line room class.
 *
 * @private
 * @class ServerRoom
 * @param {string} name Room name
 * @property {string} name
 */
class ServerRoom {
    constructor(name, connections = {}) {
        this.name = name;
        this.connections = connections;
    }


    /**
     * Adds a connection into room.
     * @param {ServerConnection} connection
     */
    add(connection) {
        // TODO: Check current existing connection maybe?
        this.connections[connection.id] = connection;
    }


    /**
     * Removes a connection from room.
     * @param {ServerConnection} connection
     * @returns {boolean}
     */
    remove(connection) {
        if (connection != this.connections[connection.id]) {
            debug(`[${this.name || 'root'}] Did not remove "${connection.id}", connection instance is not added or different`);
            return false;
        }

        debug(`[${this.name || 'root'}] Removing "${connection.id}"`);
        delete this.connections[connection.id];
        return true;
    }


    /**
     * Gets a connection by id.
     * @param {string} connectionId
     * @returns {?ServerConnection}
     */
    getConnectionById(connectionId) {
        return this.connections[connectionId];
    }


    /**
     * Gets all connections in the room. Returns a object where keys are
     * connection id and values are ServerConnection.
     * @returns {{string: ServerConnection}}
     */
    getConnections() {
        return clone(this.connections);
    }


    /**
     * Returns the total connection count in room.
     * @returns {number}
     */
    getConnectionsCount() {
        return Object.keys(this.connections).length;
    }


    broadcast_(message) {
        forEach(this.connections, connection => {
            connection
                .sendWithoutResponse_(message)
                .catch((err) => {
                    debug(`[${this.name || 'root'}] Could not send "${message.name}" to "${connection.id}" while broadcasting, ignoring...`);
                });
        });
    }


    /**
     * Broadcast a message to all connections in the room.
     * @param {string} name
     * @param {any=} payload
     */
    broadcast(name, payload) {
        const message = new Message({name, payload}); // Can throw INVALID_JSON
        this.broadcast_(message);
    }
}


module.exports = ServerRoom;
