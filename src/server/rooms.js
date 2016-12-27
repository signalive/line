const filter = require('lodash/filter');
const forEach = require('lodash/forEach');
const map = require('lodash/map');
const Room = require('./room');


class Rooms {
    constructor() {
        this.rooms = {};
        this.root = new Room();
    }

    add(roomName, connection) {
        if(!this.rooms[roomName])
            this.rooms[roomName] = new Room(roomName);

        this.rooms[roomName].add(connection);
    }

    remove(roomName, connection) {
        if(!this.rooms[roomName])
            return;

        this.rooms[roomName].remove(connection);

        if (!this.rooms[roomName].getConnectionsCount())
            delete this.rooms[roomName];
    }

    getRoomsOf(connection) {
        return map(filter(this.rooms, room => room.getConnectionById(connection.id)), 'name');
    }

    getRoom(room) {
        return this.rooms[room];
    }

    removeFromAll(connection) {
        const rooms = this.getRoomsOf(connection);
        forEach(rooms, roomName => this.rooms[roomName].remove(connection));
    }
}


module.exports = Rooms;
