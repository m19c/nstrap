'use strict';

var Promise = require('bluebird'),
    NStrap  = require('../').NStrap,
    kernel  = new NStrap();

kernel.add('env', function (done) {
  return done(process.env.NODE_ENV || 'dev');
});

kernel.add('config', ['env'], function (env) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({
        env:      env,
        database: {
          sets: 'mongodb://localhost/main'
        }
      });
    }, 500);
  });
});

kernel.add('database', ['config', 'env'], function (config, env, done) {
  done({ connected: true, options: config.database });
});

kernel.run()
  .then(function (res) {
    console.log(res);
  })
;