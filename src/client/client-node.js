global.WebSocket = require('uws');
const WebClient = require('./client-web');


class NodeClient extends WebClient {
    bindEvents_() {
        this.ws_.on('open', this.onOpen.bind(this));
        this.ws_.on('error', this.onError.bind(this));

        this.ws_.on('close', (code, reason) => {
            this.onClose({code, reason});
        });

        this.ws_.on('message', (data) => {
            this.onMessage({data});
        });
    }


    send_(message) {
        return new Promise((resolve, reject) => {
            this.ws_.send(message.toString(), err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}


module.exports = NodeClient;
