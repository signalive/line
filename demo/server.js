const Server = require('../dist/server');

const server = new Server({port: 3000, verifyClient: function(info, callback) {
	callback(true);
}});

server
	.start()
	.then(_ => {
		console.log('Server started');
	})
	.catch(err => {
		console.log(`Server could not started`, err);
	});


server.on('connection', function(connection) {
	console.log('A client connected');
	connection.on('asd', (payload, done) => {
		console.log('received', payload);

		setTimeout(function() {
			console.log('responding...');
			done && done(null, {domates: 'patates'});
		}, 2000)
	})

	connection.on('close', code => {
		console.log(` ${code} closed`);
	})
})