const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

const Server = require('../dist/server');
const Client = require('../dist/client-node');

describe('Line Tests', function() {
    let server;
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
            });
    });


    afterEach(function() {
        return server
            .stop()
            .then(_ => {
                server = null;
                clients = null;
            });
    });


    it('new clients should connect to server', function() {
        const client1OpenSpy = sinon.spy();
        const client2OpenSpy = sinon.spy();
        const serverConnectionSpy = sinon.spy();

        const client1 = new Client('ws://localhost:3000');
        const client2 = new Client('ws://localhost:3000');
        client1.on('_open', client1OpenSpy);
        client2.on('_open', client2OpenSpy);

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


    it('client should send message to server', function() {
        const connections = clients.map(client => server.getConnectionById(client.id));
        const spies = [
            sinon.spy(message => message.resolve()),
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
            .then(_ => {
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[1].should.not.have.been.called;
                spies[2].should.not.have.been.called;
                spies[3].should.not.have.been.called;
            });
    });


    it('server should send message to specific client', function() {
        const connections = clients.map(client => server.getConnectionById(client.id));
        const spies = [
            sinon.spy(message => message.resolve()),
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
            .then(_ => {
                spies[0].should.have.been.calledOnce;
                spies[0].should.have.been.calledWithMatch({payload: {hello: 'world'}});
                spies[1].should.not.have.been.called;
                spies[2].should.not.have.been.called;
                spies[3].should.not.have.been.called;
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

        server.rooms
            .getRoom('/')
            .broadcast('test', {hello: 'world'});

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
        const connections = clients.map(client => server.getConnectionById(client.id));
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
                spies[3].should.have.been.calledOnce;
                spies[3].should.have.been.calledWithMatch({payload: {hello: 'from room2'}});
            });
    });
});


function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
