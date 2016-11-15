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
    let client;

    beforeEach(function() {
        server = new Server({port: 3000});
        client = new Client();
        return server.start();
    });

    afterEach(function() {
        return server
            .stop()
            .then(() => {
                server = null;
                client = null;
            });
    });


    it('client should connect to server', function(done) {
        const clientOpenSpy = sinon.spy();
        const serverConnectionSpy = sinon.spy();

        client.on('_open', clientOpenSpy);
        client.connect('ws://localhost:3000');

        server.on('connection', serverConnectionSpy);

        // client.connect() promise olsaydi?
        setTimeout(() => {
            clientOpenSpy.should.have.been.calledOnce;
            serverConnectionSpy.should.have.been.calledOnce;
            done();
        }, 50);
    });
});
