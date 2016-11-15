import * as _ from 'lodash';
import Room from './room';


export default class Rooms {
	constructor() {
		this.rooms = {'/': new Room('/')};
	}

	add(roomName, connection) {
		if(!this.rooms[roomName])
			this.rooms[roomName] = new Room(roomName);

		this.rooms[roomName].add(connection);
	}

	remove(roomName, connection) {
		if(!this.rooms[roomName])
			return;

		this.rooms[roomName].remove(connection.id);

		if (roomName != '/' && !this.rooms[roomName].getConnectionsCount())
			delete this.rooms[roomName];
	}

	getRoomsOf(connection) {
		return _.map(_.filter(this.rooms, room => room.getConnectionById(connection.id)), 'name');
	}

	getRoom(room) {
		return this.rooms[room];
	}

	removeFromAll(connection) {
		const rooms = this.getRoomsOf(connection);
		_.forEach(rooms, roomName => this.rooms[roomName].remove(connection));
	}
}
