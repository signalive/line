import WebSocket from 'uws';
import WebClient from './client-web';
global.WebSocket = WebSocket;


class NodeClient extends WebClient {
	bindEvents() {
		this.ws.on('open', this.onOpen.bind(this));
		this.ws.on('error', this.onError.bind(this));

		this.ws.on('close', (code, reason) => {
			this.onClose({code, reason});
		});

		this.ws.on('message', (data) => {
			this.onMessage({data});
		});
	}


	send_(message) {
		return new Promise((resolve, reject) => {
			this.ws.send(message.toString(), err => {
				if (err) return reject(err);
				resolve();
			});
		});
	}
}


module.exports = NodeClient;
