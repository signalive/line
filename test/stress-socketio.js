const _ = require('lodash');
const vorpal = require('vorpal')();
const io = require('socket.io')(3000);

const clients = [];

global.desiredClient = 10;
global.batchLimit = 15;
global.checkInterval = 250;
global.heartbeatInterval = 1000;
global.requestLength = 5;
global.responseLength = 5;


class StressTestClient {
    constructor() {
        this.client = require('socket.io-client')('http://localhost:3000');
        this.timeout = null;
    }

    init() {
        this.client.on('connect', () => {
            this.sendTestMessage();
        });
    }

    sendTestMessage() {
        this.client.emit('test', getRandomString(global.requestLength), (data) => {
            // console.log('response', data);
        });

        this.timeout = setTimeout(this.sendTestMessage.bind(this), global.heartbeatInterval);
    }

    dispose() {
        clearTimeout(this.timeout);
        this.client.disconnect();
    }
}


io.on('connection', function (socket) {
    socket.on('test', (payload, done) => {
        done(getRandomString(global.responseLength));
    });
});


setInterval(() => {
    vorpal.log(`Server connections: -, Clients: ${clients.length}`);
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
        _.times(Math.min(global.desiredClient, global.batchLimit), _ => createClient());
    } else if (global.desiredClient < clients.length) {
        const diff = clients.length - global.desiredClient;
        _.times(Math.min(diff, global.batchLimit), _ => removeClient());
    } else {
        // vorpal.log('OK');
    }
}, global.checkInterval);


vorpal
    .command('get client-count')
    .description('Gets desired client number.')
    .action(function(args, done) {
        vorpal.log(global.desiredClient);
        done();
    });


vorpal
    .command('set client-count <count>')
    .description('Sets desired client number.')
    .action(function(args, done) {
        global.desiredClient = parseInt(args.count, 10);
        done();
    });


vorpal
    .command('get heartbeat-interval')
    .description('Gets heartbeat message interval.')
    .action(function(args, done) {
        vorpal.log(global.heartbeatInterval);
        done();
    });


vorpal
    .command('set heartbeat-interval <interval>')
    .description('Sets heartbeat message interval.')
    .action(function(args, done) {
        global.heartbeatInterval = parseInt(args.interval, 10);
        done();
    });


vorpal
    .command('get req-length')
    .description('Gets heartbeat message payload length.')
    .action(function(args, done) {
        vorpal.log(global.requestLength);
        done();
    });


vorpal
    .command('set req-length <length>')
    .description('Sets heartbeat message payload length.')
    .action(function(args, done) {
        global.requestLength = parseInt(args.length, 10);
        done();
    });


vorpal
    .command('get res-length')
    .description('Gets heartbeat response payload length.')
    .action(function(args, done) {
        vorpal.log(global.responseLength);
        done();
    });


vorpal
    .command('set res-length <length>')
    .description('Sets heartbeat response payload length.')
    .action(function(args, done) {
        global.responseLength = parseInt(args.length, 10);
        done();
    });


vorpal
    .delimiter('>')
    .show();

