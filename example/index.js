'use strict';

var Promise = require('bluebird'),
    NStrap  = require('../').NStrap,
    kernel  = new NStrap();

kernel.add('config', function () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({
        database: {
          sets: 'mongodb://localhost/main'
        }
      });
    }, 500);
  });
});

kernel.add('database', ['config'], function (config, done) {
  done({ connected: true, options: config.database });
});

kernel.run()
  .then(function (res) {
    console.log(res);
  })
;