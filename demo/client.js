const client = new LineClient('ws://localhost:3000', {
    reconnect: true,
    handshakePayload: {hello: 'shake'}
});

client
    .connect()
    .then(() => {
        console.log('Our client has connected');
    })
    .catch(err => {
        console.log('Could not connect', err);
    });

client.on('_connecting_error', function() {
    console.log('connecting error!!!');
});

client.on('_closing', function() {
    console.log('closing...');
});

client.on('_closed', function() {
    console.log('closed');
});

client.on('_connected', function() {
    console.log(`Client connected`);
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


client.on('_connecting', function() {
    console.log('connecting...');
});


client.on('tick', function(message) {
    console.log('tick received');
});

setTimeout(() => {
    client
        .disconnect()
        .then(() => {
            console.log('disconnected');
            return client.connect();
        })
        .catch(err => {
            console.log('could not disconnected', err);
        });
}, 10000);
