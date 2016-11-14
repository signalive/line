import * as _ from 'lodash';
import * as uuid from 'node-uuid';
import EventEmitter from 'event-emitter-extra';



export default class Message extends EventEmitter {
	static parse(raw) {
		try {
			const data = JSON.parse(raw);
			return new Message({
				name: data.n,
				payload: data.p,
				err: data.e,
				id: data.i
			});
		} catch(err) {
			throw new Error(`Could not parse message.`);
		}
	}

	constructor({name, payload, id, err}) {
		super();

		this.name = name;
		this.payload = payload;
		this.id = id;
		this.err = err;

		this.isResponded_ = false;
	}

	setId(id = uuid.v4()) {
		this.id = id;
		return id;
	}

	toString() {
		try {
			const data = {n: this.name};

			if (!_.isUndefined(this.payload))
				data.p = this.payload;

			if (!_.isUndefined(this.id))
				data.i = this.id;

			if (!_.isUndefined(this.err))
				data.e = this.err;

			return JSON.stringify(data);
		} catch(err) {
			throw new Error(`Could not stringify message.`);
		}
	}

	createResponse(err, payload) {
		return new Message({name: '_r', payload, err, id: this.id});
	}

	resolve(payload) {
		if (_.isUndefined(this.id))
			return console.warn('[line] A message without an id cannot be resolved.');

		if (this.isResponded_)
			return console.warn('[line] This message has already been ended.');

		this.isResponded_ = true;
		this.emit('resolved', payload);
	}

	reject(err) {
		if (_.isUndefined(this.id))
			return console.warn('[line] A message without an id cannot be rejected.');

		if (this.isResponded_)
			return console.warn('[line] This message has already been ended.');

		this.isResponded_ = true;
		this.emit('rejected', err);
	}
}

Message.reservedNames = ['_r'];
