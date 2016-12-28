global.WebSocket = require('uws');
const WebClient = require('./client-web');


class NodeClient extends WebClient {
    bindEvents_() {
        this.ws_.on('open', this.onOpen.bind(this));
        this.ws_.on('error', this.onError.bind(this));

        this.ws_.on('close', (code, reason) => {
            if (code == 0) code = 1005;
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


    onError(err) {
        if (!err) err = {code: 1006, reason: ''};

        super.onError();

        /* Work-around for node; onClose not being called after error */
        setTimeout(_ => this.onClose(err));
    }

}


module.exports = NodeClient;
