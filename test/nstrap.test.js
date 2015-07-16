var chai   = require('chai'),
    cap    = require('chai-as-promised'),
    assert = chai.assert,
    NStrap = require('../');

chai.use(cap);

describe('nstrap', function () {
  'use strict';

  describe('set', function () {
    it('throws an error if the obtained name is not a string');
    it('throws an error if the task is not a function');
    it('accepts two arguments (name and task)');
    it('accepts three arguments (name, deps and task)');
    it('stores the necessary information on registry and registryMap');

    describe('third-party implementation', function () {
      it('accepts an object with the basic information e.g. name, deps and task');
      it('accepts an object with a provider function');
    });
  });

  describe('get', function () {
    it('throws an error if the obtained name is not a string');
    it('returns the correct value after the NStrap node is called');
  });

  describe('logical tract', function () {
    it('resolves correctly', function () {
      var bootstrap = new NStrap();

      bootstrap.add('l', function (next) {
        next(1);
      });

      bootstrap.add('e', function (next) {
        next(3);
      });

      bootstrap.add('t', function (next) {
        next(7);
      });

      bootstrap.add('leet', ['l', 'e', 'e', 't'], function (l, e1, e2, t, next) {
        next([l, e1, e2, t].join(''));
      });

      process.nextTick(function () {
        assert.eventually.equal(bootstrap.get('leet'), 1337);
      });
      bootstrap.run();
    });

    it('rejects once the timeout exceeded');
    it('cancels all the provided tasks once the timeout is exceeded');
  });
});