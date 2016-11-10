import * as _ from 'lodash';


export default class Rooms {
	constructor() {
		this.rooms = {'/': {}};
	}

	add(roomName, connection) {
		if(!this.rooms[roomName])
			this.rooms[roomName] = {};

		this.rooms[roomName][connection.id] = connection;
	}

	remove(roomName, connection) {
		if(!this.rooms[roomName])
			return;

		delete this.rooms[roomName][connection.id];

		if (roomName != '/' && _.isEmpty(this.rooms[roomName]))
			delete this.rooms[roomName];
	}

	getRoomsOf(connection) {
		return _.keys(_.filter(this.rooms, connections => connections[connection.id]));
	}

	removeFromAll(connection) {
		const rooms = this.getRoomsOf(connection);
		_.forEach(rooms, room => this.remove(room, connection));
	}
}
