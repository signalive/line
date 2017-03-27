const assign = require('lodash/assign');


// http://stackoverflow.com/a/6248722
function generateDummyId(length = 4) {
    return ("0000" + (Math.random()*Math.pow(36,length) << 0).toString(36)).slice(-length);
}


module.exports = {generateDummyId};
