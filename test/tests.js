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
                const tasks = clients.map(client => client.connect());
                return Promise.all(tasks);
            })
            .then(_ => {
                connections = clients.map(client => server.getConnectionById(client.id));
            });
    });


    afterEach(function() {
        return server
            .stop()
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
                client1.connect(),
                client2.connect()
            ])
            .then(_ => {
                client1OpenSpy.should.have.been.calledOnce;
                client2OpenSpy.should.have.been.calledOnce;
                serverConnectionSpy.should.have.been.calledTwice;
            });
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
                err.message.should.equal('Message rejected bro');
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
        clients[0].serverTimeout_ = 100;

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
                err.message.should.equal('Hmmmppph, no');
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
        server.options.timeout = 100;

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
            new Client('ws://localhost:3001', {handshakePayload: {id: 1}}),
            new Client('ws://localhost:3001', {handshakePayload: {id: 2}}),
            new Client('ws://localhost:3001', {handshakePayload: {id: 3}})
        ];

        server.on('handshake', (connection, handshake) => {
            if (handshake.payload.id <= 2)
                handshake.resolve({welcome: 'bro'});
            else
                handshake.reject(new Error('Sorry bro'));
        });

        return server
            .start()
            .then(_ => clients[0].connect())
            .then(response => {
                response.should.deep.equal({welcome: 'bro'});
                return clients[1].connect();
            })
            .then(response => {
                response.should.deep.equal({welcome: 'bro'});
                return clients[2].connect();
            })
            // .should.be.rejectedWith(Error) // TODO: Support this
            .should.be.rejected
            // TODO: Rejected client should not retry to connect!
            .then(_ => Promise.all([
                clients[0].disconnect(),
                clients[1].disconnect()
            ]))
            .then(_ => server.stop());
    });


    it('server should auto ping clients (3 times)', function() {
        this.timeout(4000);

        const server = new Server({port: 3001, pingInterval: 1000});
        const clients = [
            new Client('ws://localhost:3001'),
            new Client('ws://localhost:3001')
        ];

        const spies = [
            sinon.spy(clients[0], 'onPing_'),
            sinon.spy(clients[1], 'onPing_')
        ];

        return server
            .start()
            .then(_ => Promise.all([
                clients[0].connect(),
                clients[1].connect()
            ]))
            .then(_ => wait(3500))
            .then(_ => {
                spies[0].should.be.calledThrice;
                spies[1].should.be.calledThrice;

                spies[0].restore();
                spies[1].restore();
            })
            .then(_ => Promise.all([
                clients[0].disconnect(),
                clients[1].disconnect()
            ]))
            .then(_ => server.stop());
    });


    it('server should close connection if ping is failed', function() {
        const connectionPingStub = sinon.stub(connections[0], 'send');
        connectionPingStub.withArgs('_p').returns(Promise.reject(new Error('No ping allowed')));
        connectionPingStub.returns(Promise.resolve());

        const clientCloseSpy = sinon.spy();
        clients[0].on('_closed', clientCloseSpy);

        return connections[0]
            .ping()
            .should.be.rejectedWith(Error)
            .then(err => {
                err.message.should.equal('No ping allowed');
                connectionPingStub.restore();

                return wait(50);
            })
            .then(_ => {
                clientCloseSpy.should.have.been.calledOnce;
            });
    });


    it('client should close connection if ping is failed', function() {
        const clientPingStub = sinon.stub(clients[0], 'send');
        clientPingStub.withArgs('_p').returns(Promise.reject(new Error('No ping allowed')));
        clientPingStub.returns(Promise.resolve());

        const connectionCloseSpy = sinon.spy();
        connections[0].on('_close', connectionCloseSpy);

        return clients[0]
            .ping()
            .should.be.rejectedWith(Error)
            .then(err => {
                err.message.should.equal('No ping allowed');
                clientPingStub.restore();

                return wait(50);
            })
            .then(_ => {
                connectionCloseSpy.should.have.been.calledOnce;
            });
    });
});


function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
