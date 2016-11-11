const WebSocket = require('uws');
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
    console.log('Connected!');
    ws.send(JSON.stringify({event: 'asd', payload: {foo: 'bar'}, options: {id: 'ididid'}}));
});

ws.on('error', function error(err) {
    console.log('Error connecting!', err);
});

ws.on('message', function(data, flags) {
	// const d = JSON.parse(data);
    console.log('Message: ', data);

});

ws.on('close', function(code, message) {
    console.log('Disconnection: ' + code + ', ' + message);
});