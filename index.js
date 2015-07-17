var NStrap          = require('./lib/nstrap'),
    NStrapInterface = require('./lib/nstrap-interface');

module.exports = function () {
  'use strict';

  return new NStrap();
};

module.exports.NStrap = NStrap;
module.exports.NStrapInterface = NStrapInterface;