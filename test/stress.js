const _ = require('lodash');
const readline = require('readline');
const Server = require('../dist/server');
const Client = require('../dist/client-node');

const server = new Server({port: 3000});
const clients = [];

global.desiredClient = 0;
global.batchLimit = 10;
global.checkInterval = 250;
global.heartbeatInterval = 1000;
global.requestLength = 5;
global.responseLength = 5;


class StressTestClient {
    constructor() {
        this.client = new Client('ws://localhost:3000');
        this.timeout = null;
    }

    init() {
        this.client
            .connectAsync()
            .then(_ => this.sendTestMessage())
            .catch(err => {
                console.log('Client could not connect', err);
            });
    }

    sendTestMessage() {
        this.client
            .send('test', getRandomString(global.requestLength))
            .catch(err => {
                console.log('Could not get response for test');
            });

        this.timeout = setTimeout(this.sendTestMessage.bind(this), global.heartbeatInterval);
    }

    dispose() {
        clearTimeout(this.timeout);

        this.client
            .disconnectAsync()
            .catch(err => {
                console.log('Could not disconnect', err);
            });
    }
}


server
    .start()
    .then(() => console.log('Server started'))
    .catch(err => {
        console.log('Server could not started', err);
        process.exit(1);
    });


server.on('connection', connection => {
    connection.on('test', message => {
        message.resolve(getRandomString(global.responseLength));
    });
});


setInterval(() => {
    console.log(`Server connections: ${_.size(server.rooms.root.connections)}, Clients: ${clients.length}`);
}, 2500);


function createClient() {
    const client = new StressTestClient();
    client.init();
    clients.push(client);
}


function removeClient() {
    const client = clients.shift();
    client.dispose();
}


function getRandomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}


setInterval(() => {
    if (global.desiredClient > clients.length) {
        const diff = global.desiredClient - clients.length;
        _.times(Math.min(diff, global.batchLimit), _ => createClient());
    } else if (global.desiredClient < clients.length) {
        const diff = clients.length - global.desiredClient;
        _.times(Math.min(diff, global.batchLimit), _ => removeClient());
    }
}, global.checkInterval);


const commands = {
    'client-count': 'desiredClient',
    'heartbeat-interval': 'heartbeatInterval',
    'req-length': 'requestLength',
    'res-length': 'responseLength'
};

const rl = readline.createInterface({input: process.stdin, output: process.stdout, prompt: '> '});

rl.on('line', line => {
    const [action, name, value] = line.trim().split(/\s+/);
    const property = commands[name];
    const parsedValue = parseInt(value, 10);

    if (action == 'get' && property) {
        console.log(global[property]);
    } else if (action == 'set' && property && !isNaN(parsedValue)) {
        global[property] = parsedValue;
    } else if (line.trim() != '') {
        console.log(`Usage: get|set ${Object.keys(commands).join('|')} [value]`);
    }

    rl.prompt();
});

rl.prompt();
