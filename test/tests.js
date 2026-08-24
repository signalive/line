'use strict';

const http = require('http');

describe('Line Tests', function() {

    let server;
    let connections;
    let clients;


    beforeEach(function() {
        server = new Server({port: 3000});
        clients = [
            new Client('ws://localhost:3000'),
            new Client('ws://localhost:3000'),
            new Client('ws://localhost:3000'),
            new Client('ws://localhost:3000')
        ];

        return server
            .start()
            .then(_ => {
                const tasks = clients.map(client => client.connectAsync());
                return Promise.all(tasks);
            })
            .then(_ => {
                connections = clients.map(client => server.getConnectionById(client.id));
            });
    });


    afterEach(function() {
        const tasks = clients.map(client => client.disconnectAsync());
        return Promise
            .all(tasks)
            .then(() => server.stop())
            .then(_ => {
                server = null;
                clients = null;
                connections = null;
            });
    });


    it('new clients should connect to server', function() {
        const client1OpenSpy = sinon.spy();
        const client2OpenSpy = sinon.spy();
        const serverConnectionSpy = sinon.spy();

        const client1 = new Client('ws://localhost:3000');
        const client2 = new Client('ws://localhost:3000');
        client1.on('_connected', client1OpenSpy);
        client2.on('_connected', client2OpenSpy);

        server.on('connection', serverConnectionSpy);

        return Promise.all([
                client1.connectAsync(),
                client2.connectAsync()
            ])
            .then(_ => {
                client1OpenSpy.should.have.been.calledOnce;
                client2OpenSpy.should.have.been.calledOnce;
                serverConnectionSpy.should.have.been.calledTwice;
            })
            .then(_ => Promise.all([
                client1.disconnectAsync(),
                client2.disconnectAsync()
            ]));
    });


    it('client should send message to server and server should resolve', function() {
        const spies = [
            sinon.spy(message => message.resolve({some: 'response'})),
            sinon.spy(message => message.resolve()),
            sinon.spy(message => message.resolve()),
            sinon.spy(message => message.resolve())
        ];

        connections[0].on('test', spies[0]);
        connections[1].on('test', spies[1]);
        connections[2].on('test', spies[2]);
        connections[3].on('test', spies[3]);

        return clients[0]
            .send('test', {hello: 'world'})
            .then(response => {
                response.should.deep.equal({some: 'response'})
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[1].should.not.have.been.called;
                spies[2].should.not.have.been.called;
                spies[3].should.not.have.been.called;
            });
    });


    it('client should send message to server and server should reject', function() {
        const spy = sinon.spy(message => message.reject(new Error('Message rejected bro')));
        connections[0].on('test', spy);

        return clients[0]
            .send('test', {hello: 'world'})
            .should.be.rejectedWith(Error)
            .then(err => {
                err.payload.message.should.equal('Message rejected bro');
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('client should send message without response to server', function() {
        const spy = sinon.spy();
        connections[0].on('test', spy);

        return clients[0]
            .sendWithoutResponse('test', {hello: 'world'})
            .then(_ => wait(10))
            .then(_ => {
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('client.send() should fail timeout exceed', function() {
        const spy = sinon.spy(message => {
            setTimeout(_ => {
                message.resolve();
            }, 200);
        });

        connections[0].on('test', spy);
        clients[0].options.responseTimeout = 100;

        return clients[0]
            .send('test', {hello: 'world'})
            .should.be.rejectedWith(Error)
            .then(_ => wait(200))
            .then(_ => {
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('server should send message to specific client and client should resolve', function() {
        const spies = [
            sinon.spy(message => message.resolve({some: 'response'})),
            sinon.spy(message => message.resolve()),
            sinon.spy(message => message.resolve()),
            sinon.spy(message => message.resolve())
        ];

        clients[0].on('test', spies[0]);
        clients[1].on('test', spies[1]);
        clients[2].on('test', spies[2]);
        clients[3].on('test', spies[3]);

        return connections[0]
            .send('test', {hello: 'world'})
            .then(response => {
                response.should.deep.equal({some: 'response'});
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[1].should.not.have.been.called;
                spies[2].should.not.have.been.called;
                spies[3].should.not.have.been.called;
            });
    });


    it('server should send message to specific client and client should reject', function() {
        const spy = sinon.spy(message => message.reject(new Error('Hmmmppph, no')));
        clients[0].on('test', spy);

        return connections[0]
            .send('test', {hello: 'world'})
            .should.be.rejectedWith(Error)
            .then(err => {
                err.payload.message.should.equal('Hmmmppph, no');
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('server should send message without response to specific client', function() {
        const spy = sinon.spy();
        clients[0].on('test', spy);

        return connections[0]
            .sendWithoutResponse('test', {hello: 'world'})
            .then(_ => wait(10))
            .then(_ => {
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('connection.send() should fail if timeout exceed', function() {
        const spy = sinon.spy(message => {
            setTimeout(_ => {
                message.resolve();
            }, 200);
        });

        clients[0].on('test', spy);
        server.options.responseTimeout = 100;

        return connections[0]
            .send('test', {hello: 'world'})
            .should.be.rejectedWith(Error)
            .then(_ => wait(200))
            .then(_ => {
                spy.should.have.been.calledOnce;
                spy.should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('server should broadcast message', function() {
        const spies = [
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy()
        ];

        clients[0].on('test', spies[0]);
        clients[1].on('test', spies[1]);
        clients[2].on('test', spies[2]);
        clients[3].on('test', spies[3]);

        server.broadcast('test', {hello: 'world'});

        return wait(10)
            .then(_ => {
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[1].should.have.been.calledOnce;
                spies[1].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[2].should.have.been.calledOnce;
                spies[2].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[3].should.have.been.calledOnce;
                spies[3].should.have.been.calledWithMatch({payload: {hello: 'world'}});
            });
    });


    it('server should broadcast message to specific room', function() {
        const spies = [
            sinon.spy(),
            sinon.spy(),
            sinon.spy(),
            sinon.spy()
        ];

        connections[0].joinRoom('room1');
        connections[1].joinRoom('room1');
        connections[2].joinRoom('room2');
        connections[3].joinRoom('room2');
        connections[3].leaveRoom('room2');

        clients[0].on('test', spies[0]);
        clients[1].on('test', spies[1]);
        clients[2].on('test', spies[2]);
        clients[3].on('test', spies[3]);

        server.rooms
            .getRoom('room1')
            .broadcast('test', {hello: 'from room1'});

        server.rooms
            .getRoom('room2')
            .broadcast('test', {hello: 'from room2'});

        return wait(10)
            .then(_ => {
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'from room1'}});
                spies[1].should.have.been.calledOnce;
                spies[1].should.have.been.calledWithMatch({payload: {hello: 'from room1'}});
                spies[2].should.have.been.calledOnce;
                spies[2].should.have.been.calledWithMatch({payload: {hello: 'from room2'}});
                spies[3].should.not.have.been.called;
            });
    });


    it('server should accept/reject handshake', function() {
        const server = new Server({port: 3001});
        const clients = [
            new Client('ws://localhost:3001', {handshake: {payload: {id: 1}}}),
            new Client('ws://localhost:3001', {handshake: {payload: {id: 2}}}),
            new Client('ws://localhost:3001', {handshake: {payload: {id: 3}}, reconnect: false})
        ];

        server.on('handshake', (connection, handshake) => {
            if (handshake.payload.id <= 2)
                handshake.resolve({welcome: 'bro'});
            else
                handshake.reject(new Error('Sorry bro'));
        });

        return server
            .start()
            .then(() => {
                return clients[0].connectAsync();
            })
            .then(response => {
                response.should.deep.equal({welcome: 'bro'});
                return clients[1].connectAsync();
            })
            .then(response => {
                response.should.deep.equal({welcome: 'bro'});
                return clients[2].connectAsync();
            })
            .should.eventually.be.rejectedWith(Error)
            // TODO: Rejected client should not retry to connect!
            .then(() => Promise.all([
                clients[0].disconnectAsync(),
                clients[1].disconnectAsync()
            ]))
            .then(() => server.stop());
    });


    it('server should auto ping clients (3 times)', function() {
        const server = new Server({port: 3001, pingInterval: 1000});
        const clients = [
            new Client('ws://localhost:3001'),
            new Client('ws://localhost:3001')
        ];

        const spies = [
            sinon.spy(clients[0], 'onPingMessage_'),
            sinon.spy(clients[1], 'onPingMessage_')
        ];

        return server
            .start()
            .then(_ => Promise.all([
                clients[0].connectAsync(),
                clients[1].connectAsync()
            ]))
            .then(_ => wait(3500))
            .then(_ => {
                spies[0].should.be.calledThrice;
                spies[1].should.be.calledThrice;

                spies[0].restore();
                spies[1].restore();
            })
            .then(_ => Promise.all([
                clients[0].disconnectAsync(),
                clients[1].disconnectAsync()
            ]))
            .then(_ => server.stop());
    });


    it('server should close connection if ping is failed', function() {
        // Seperate our interested client&connections because
        // in afterEach hook, we're trying to disconnect them!
        const connection = connections.pop();
        const client = clients.pop();

        const connectionPingStub = sinon.stub(connection, 'send_');
        connectionPingStub.withArgs(sinon.match({name: '_p'})).returns(Promise.reject(new Error('No ping allowed')));
        connectionPingStub.returns(Promise.resolve());

        const clientCloseSpy = sinon.spy();
        client.on('_disconnected', clientCloseSpy);

        return connection
            .ping()
            .should.be.rejectedWith(Error)
            .then(err => {
                err.payload.message.should.equal('No ping allowed');
                connectionPingStub.restore();

                return wait(50);
            })
            .then(_ => {
                clientCloseSpy.should.have.been.calledOnce;

                client.options.reconnect = false;
                client.resetReconnectState_();
            });
    });


    it('client should close connection if ping is failed', function() {
        // Seperate our interested client&connections because
        // in afterEach hook, we're trying to disconnect them!
        const connection = connections.pop();
        const client = clients.pop();

        const clientPingStub = sinon.stub(client, 'send_');
        clientPingStub.withArgs(sinon.match({name: '_p'})).returns(Promise.reject(new Error('No ping allowed')));
        clientPingStub.returns(Promise.resolve());

        const connectionCloseSpy = sinon.spy();
        connection.on('_disconnected', connectionCloseSpy);

        return client
            .ping()
            .should.be.rejectedWith(Error)
            .then(err => {
                err.payload.message.should.equal('No ping allowed');
                clientPingStub.restore();

                return wait(50);
            })
            .then(_ => {
                connectionCloseSpy.should.have.been.calledOnce;

                client.options.reconnect = false;
                client.resetReconnectState_();
            });
    });
});


describe('Client.fetchResponseUrl', function() {

    let httpServer;
    let handler;
    let requestCount;
    let url;


    beforeEach(function() {
        requestCount = 0;
        handler = (req, res) => res.end();

        httpServer = http.createServer((req, res) => {
            requestCount++;
            handler(req, res);
        });

        return new Promise(resolve => {
            httpServer.listen(0, '127.0.0.1', _ => {
                url = `http://127.0.0.1:${httpServer.address().port}/`;
                resolve();
            });
        });
    });


    afterEach(function() {
        return new Promise(resolve => httpServer.close(resolve));
    });


    it('should resolve with the location header of a 301/302 response', function() {
        let method;

        handler = (req, res) => {
            method = req.method;
            res.writeHead(301, {location: 'http://localhost:9999/redirected'});
            res.end();
        };

        return Client
            .fetchResponseUrl(url)
            .then(location => {
                location.should.equal('http://localhost:9999/redirected');
                method.should.equal('HEAD');
                requestCount.should.equal(1);

                handler = (req, res) => {
                    res.writeHead(302, {location: 'http://localhost:9999/redirected'});
                    res.end();
                };
                return Client.fetchResponseUrl(url);
            })
            .then(location => location.should.equal('http://localhost:9999/redirected'));
    });


    it('should use the https transport for https urls', function() {
        return Client
            .fetchResponseUrl(url.replace('http://', 'https://'))
            .should.be.rejectedWith(Error)
            .then(err => err.code.should.not.equal('ERR_INVALID_PROTOCOL'));
    });


    it('should reject if the response is not a redirection or has no location header', function() {
        handler = (req, res) => {
            res.writeHead(200);
            res.end();
        };

        return Client
            .fetchResponseUrl(url)
            .should.be.rejectedWith(Error)
            .then(err => {
                err.message.should.equal('Not redirected, status code: "200"');

                handler = (req, res) => {
                    res.writeHead(301);
                    res.end();
                };
                return Client.fetchResponseUrl(url).should.be.rejectedWith(Error);
            })
            .then(err => err.message.should.equal('Redirected, but no location header'));
    });


    it('should reject if timeout exceed', function() {
        handler = _ => {};

        return Client
            .fetchResponseUrl(url, 100)
            .should.be.rejectedWith(Error)
            .then(err => err.code.should.equal('dExpired'));
    });


    it('should reject if the connection fails', function() {
        const closedUrl = url;

        return new Promise(resolve => httpServer.close(resolve))
            .then(_ => Client.fetchResponseUrl(closedUrl).should.be.rejectedWith(Error));
    });
});


function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
