const client = new LineClient('ws://localhost:3000');

client.on('_connecting_error', function(err) {
    console.log('connecting error!!!', err);
});

client.on('_disconnecting', function() {
    console.log('disconnecting...');
});

client.on('_disconnecting_error', function(err) {
    console.log('disconnecting error!!!', err);
});

client.on('_disconnected', function(e) {
    console.log('disconnected', e.code, e.reason);
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

client.on('_error', function(err) {
    console.log('error', err);
});

client.connect();

setTimeout(() => {
    // client.disconnect(4201, 'Close close close');
}, 10000);
