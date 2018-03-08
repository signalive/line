
line
=====

[![Build Status](https://travis-ci.org/signalive/line.svg?branch=master)](https://travis-ci.org/signalive/line)
[![Coverage Status](https://coveralls.io/repos/github/signalive/line/badge.svg?branch=master)](https://coveralls.io/github/signalive/line?branch=master)

*line* is a lightweight and efficient (web)-socket library that bears non-blocking interface and scalable architecture.  *line* is **fast**, **reliable** and yet it supports **message responses**, **response timeouts** and **client rooms**. *line* internally monitors connection health, and it pro-actively strives to achieve a stable connection.

We built *line* on top of the fastest socket implementation in the Node.JS ecosystem, [uWebSockets](https://github.com/uWebSockets/uWebSockets); however we also support javascript based [ws](https://github.com/websockets/ws) as well. When used with uws, line consumes order of magnitude **less memory** compared to socket.io and it's kinds. In order to active uws, you *should install it seperately* like a peer dependecy.

*line* runs on Node.JS and all modern browsers through an identical API. Therefore, it is a good candidate for cross-platform applications.



Key Features
------------
 - Automated tests with significant code coverage
 - **Cross platform**: Works on MacOS, Linux, Windows and browsers
 - Developed in ES6 with Webpack, therefore we have a minified bundles that work nearly every platform without hassle
 - Apart from uWebSockets, we support **message responses**, **request timeouts**, **handshaking** and **client rooms**
 - **Easy configuring**: Configurations are asserted on server side and pushed to clients at handshake. No need to do configurations at the client side.
 - Promise based API


----------

Installation
--------
Using npm
```sh
npm install line-socket --save
```

If you wish to use uws
```sh
npm install uws --save
```


Usage
-------------

### Server
```js
const Server = require('line-socket/server');
const server = new Server({port: 3000});

server.on('connection', function(connection) {
    console.log('A client connected');

    connection.on('hello', (message) => {
        console.log('Received a hello messge', message.payload); // => {name: 'some client'}

        setTimeout(() => {
            message.resolve({hello: 'yourself'});
        }, 2000)
    });
})


server
    .start() // Start listening port 3000
    .then(() => {
        console.log('Server started');
    })
    .catch((err) => {
        console.log(`Server could not started`, err);
    });
```


### Client (NodeJS)
```js
const LineClient = require('line-socket/client-node');
const client = new LineClient('ws://localhost:3000');

client.on('_connected', () => {
    console.log('Connected to server');

    client
        .send('hello', {name: 'some client'})
        .then((data) => {
            console.log('Greeting completed', data); // => {hello: 'yourself'}
        })
        .catch((err) => {
            // Message could not sent OR
            // Message response timeout OR
            // Server rejects the message
        });
});

client.connect();
```




### Client (Browser)
We provide client constructor as LineClient global reference. In order to run line client on browser, you must include the browser bundle into your HTML file as below and then use it by creating an instance from *LineClient* class.
```
<script src="../dist/client-web-globals.js"></script>
```

```js
const client = new LineClient('ws://localhost:3000');

/* The rest is identical to the NodeJS example */

```


Documentation
---------------

Extended documentation can be found [here](https://signalive.github.io/line).

-----------
License
------------

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br /><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">***line***</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">SignAlive</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
