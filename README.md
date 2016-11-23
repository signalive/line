
line
=====
*line* is a lightweight and efficient (web)-socket library that bears non-blocking interface and enormously scalable architecture.  *line* is **fast**, **reliable** and yet it supports **message responses**, **timeouts** and **rooms**. *line* internally monitors client's connection health, and it proactively strives to achieve a stable connection.

We built *line* on top of the fastest socket implementation in the Node.JS ecosystem, [uWebSockets](https://github.com/uWebSockets/uWebSockets). In that respect, it consumes order of magnitude **less memory** when compared to socket.io and it's kinds. *line* runs on Node.JS and all modern browsers through an identical API. Therefore, it is a good candidate for cross-platform applications.

Key Features
------------
 - Automated tests with significant code coverage
 - **Cross platforms**: Works on MacOS, Linux, Windows and browsers
 - Developed in ES6 with Webpack, therefore we have a minified bundles that work nearly every platform without hassle
 - Apart from uWebSockets, we support **message responses**, **request timeouts**, **handshaking** and **client rooms**
 - **Easy configuring**: Configurations are asserted on server side and pushed to clients at handshake. No need to do configurations at the client side.
 - Promise based API


----------

Installation
--------
Using NPM
```sh
npm install line-socket
```


Usage
-------------

### Server
```js
const Server = require('line-socket/server');
const server = new Server({port: 3000});

/* Handshaking handler which is called first when a new connections arrives */
server.on('handshake', (connection, handshake) => {
	/* handshale.payload is the client's handshake data such as authorization token etc... */

    handshake.resolve(); /* Accept connection */
    /* handshake.reject(new Error('Sorry bro')) to reject the connection */
});

/* Connection handler is called after client handshaking succeeds */
server.on('connection', function(connection) {
    console.log('A client connected');

    connection.on('request', message => {
        console.log('Received a request', message.payload);

        setTimeout(function() {
            console.log('Responding...');
            message.resolve({domates: 'patates'});
        }, 2000)
    });

    connection.on('_close', code => {
        console.log(` ${code} closed`);
    })
})


server
    .start() // Start listening port 3000
    .then(_ => {
        console.log('Server started');
    })
    .catch(err => {
        console.log(`Server could not started`, err);
    });
```


### Client (NodeJS)
```js
const LineClient = require('line-socket/client-node');
const client = new LineClient('ws://localhost:3000', {
    reconnect: true,
    handshakePayload: {token: 'secret-token-xyz'}
});


client
    .connect()
    .then(() => {
        console.log('Client has connected');
    })
    .catch(err => {
        console.log('Connection error', err);
    });

/* Connected event is fired when handshake is succeed */
client.on('_connected', function() {
    console.log(`Client connected`);
    console.log('Sending message to server');
    client
        .send('request', {foo: 'bar'})
        .then(response => {
            console.log('Response recieved', response);
        })
        .catch(err => {
	        /* Requests can fail by response or when timeout exceeds */
	        console.log('Request failed', err);
        });
});

```




### Client (Browser)
We provide client constructor as LineClient global reference. In order to run line client on browser, you must include the browser bundle into your HTML file as below and then use it by creating an instance from *LineClient* class.
```
<script src="../dist/client-web-globals.js"></script>
```

```js
const client = new LineClient('ws://localhost:3000', {
    reconnect: true,
    handshakePayload: {token: 'secret-token-xyz'}
});

/* The rest is identical to the NodeJS example */

```


Documentation
---------------

Extended documentation can be found [here](https://github.com/signalive/line).

-----------
License
------------

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">***line***</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">SignAlive</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.