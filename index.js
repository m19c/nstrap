var NStrap       = require('./lib/nstrap'),
    NStrapModule = require('./lib/nstrap-module');

module.exports = function () {
  'use strict';

  return new NStrap();
};

module.exports.NStrap = NStrap;
module.exports.NStrapModule = NStrapModule;