import isUndefined from 'lodash/isUndefined';
import * as uuid from 'node-uuid';
import EventEmitter from 'event-emitter-extra/dist/commonjs.modern';



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

	createResponse(err, payload) {
		return new Message({name: '_r', payload, err, id: this.id});
	}

	resolve(payload) {
		if (isUndefined(this.id))
			return console.warn('[line] A message without an id cannot be resolved.');

		if (this.isResponded_)
			return console.warn('[line] This message has already been ended.');

		this.isResponded_ = true;
		this.emit('resolved', payload);
	}

	reject(err) {
		if (isUndefined(this.id))
			return console.warn('[line] A message without an id cannot be rejected.');

		if (this.isResponded_)
			return console.warn('[line] This message has already been ended.');

		this.isResponded_ = true;
		this.emit('rejected', err);
	}

	toString() {
		try {
			const data = {n: this.name};

			if (!isUndefined(this.payload))
				data.p = this.payload;

			if (!isUndefined(this.id))
				data.i = this.id;

			if (!isUndefined(this.err))
				data.e = this.err;

			return JSON.stringify(data);
		} catch(err) {
			throw new Error(`Could not stringify message.`);
		}
	}

	dispose() {
		const events = this.eventNames();
		events.forEach(event => this.removeAllListeners(event));
	}
}

Message.reservedNames = ['_r', '_h'];
