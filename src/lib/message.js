import * as _ from 'lodash';
import * as uuid from 'node-uuid';


export default class Message {
	static parse(raw) {
		try {
			const data = JSON.parse(raw);
			return new Message(data.event, data.payload, data.options);
		} catch(err) {
			throw new Error(`Could not parse message.`);
		}
	}

	constructor(event, payload, options = {}) {
		this.event = event;
		this.payload = payload;
		this.options = options;
	}

	setId(id) {
		if (!id)
			id = uuid.v4();
		this.options.id = id;
		return id;
	}

	toString() {
		try {
			const data = {event: this.event};

			if (!_.isUndefined(this.payload))
				data.payload = this.payload;

			if (!_.isEmpty(this.options))
				data.options = this.options;

			return JSON.stringify(data);
		} catch(err) {
			throw new Error(`Could not stringify message.`);
		}
	}
}