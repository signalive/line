global.chai = require('chai');
global.chaiAsPromised = require('chai-as-promised');
global.sinon = require('sinon');
global.sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

global.Server = require('../src/server/server');
global.Client = require('../src/client/client-node');

require('./tests');
