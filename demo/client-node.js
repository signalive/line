const Client = require('../dist/client');

const client = new Client();

client.connect('ws://localhost:3000');

client.on('open', function() {
	console.log(`Client connected. readyState=${client.readyState}`);
	console.log('Sending message to server');
	client
		.send('asd', {foo: 'bar'})
		.then(response => {
			console.log('response recieved.', response);

			client
				.send('bsd', {foo: 'buzz'})
				.then(response => {
					console.log('response 2 recieved.', response);
				});
		})
});

client.on('close', function(code, message) {
	console.log(`Connection closed. readyState=${client.readyState}`, code, message);
});

client.on('error', function(err) {
	console.log(`Connection error occured. readyState=${client.readyState}`, err);
});

