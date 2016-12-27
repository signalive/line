const Server = require('../dist/server');

const server = new Server({port: 3000});

server.on('handshake', (connection, handshake) => {
    console.log(handshake.payload);
    handshake.resolve();
    // handshake.reject(new Error('Sorry bro'));
});

server
    .start()
    .then(_ => {
        console.log('Server started');
    })
    .catch(err => {
        console.log(`Server could not started`, err);
    });

setInterval(() => {
    console.log('tick', server.rooms.root.getConnectionsCount());

    server.rooms.root.broadcast('tick', {foo: Date.now()});
}, 3000);

server.on('connection', function(connection) {
    console.log('A client connected');

    connection.on('asd', message => {
        console.log('received', message.payload);

        setTimeout(function() {
            console.log('responding ...');
            message.resolve({domates: 'patates'});
        }, 2000)
    });

    connection.on('bsd', message => {
        console.log('received 2', message.payload);

        return new Promise((resolve, reject) => {
            setTimeout(function() {
                console.log('responding 2...');
                message.resolve({domates: 'patates2'});
            }, 2000)
        });
    });

    connection.on('_close', code => {
        console.log(` ${code} closed`);
    })
})