const client = new LineClient('ws://localhost:3000', {
    // handshakePayload: {authToken: 42}
    handshakePayload: {authToken: 'invalid'}
});


client.on('_connecting', function() {
    console.log('connecting...');
});

client.on('_connecting_error', function(err) {
    console.log('connecting error!!!', err);
});

client.on('_closing', function(err) {
    console.log('closing...', err);
});

client.on('_closed', function(err) {
    console.log('closed', err);
});

client.on('_error', function(err) {
    console.log('error', err);
});

client.on('_connected', function() {
    console.log(`Client connected`);

    // client
    //     .send('asd', {foo: 'bar'})
    //     .then(response => {
    //         console.log('response recieved.', response);

    //         client
    //             .send('bsd', {foo: 'buzz'})
    //             .then(response => {
    //                 console.log('response 2 recieved.', response);
    //             });
    //     })
});

client
    .connect()
    .then(() => {
        console.log('Connect promise resolved');
    })
    .catch(err => {
        console.log('Connect promise rejected', err);
    });
