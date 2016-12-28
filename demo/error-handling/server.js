const Server = require('../../dist/server');

const server = new Server({port: 3000});

server.on('handshake', (connection, handshake) => {
    // throw new Error('Oops');

    if (!handshake.payload || handshake.payload.authToken != 42) {
        const err = new Error('Auth failed');
        err.code = 401;
        return handshake.reject(err);
    }

    handshake.resolve();
});

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

    // connection.on('asd', message => {
    //     console.log('received', message.payload);

    //     setTimeout(function() {
    //         console.log('responding ...');
    //         message.resolve({domates: 'patates'});
    //     }, 2000)
    // });

    connection.on('_close', code => {
        console.log(`Connection closed with code ${code}`);
    });
});
