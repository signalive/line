const WebSocket = require('uws');
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
    console.log('Connected!');
    ws.send(JSON.stringify({event: 'asd', payload: {foo: 'bar'}}));
});

ws.on('error', function error(err) {
    console.log('Error connecting!', err);
});

ws.on('message', function(data, flags) {
    console.log('Message: ' + data);
});

ws.on('close', function(code, message) {
    console.log('Disconnection: ' + code + ', ' + message);
});