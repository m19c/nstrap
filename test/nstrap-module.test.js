var chai         = require('chai'),
    Promise      = require('bluebird'),
    NStrapModule = require('../').NStrapModule;

chai.should();

describe('NStrapModule', function () {
  'use strict';

  var current;

  beforeEach(function () {
    current = new NStrapModule();
  });

  afterEach(function () {
    current = undefined;
  });

  describe('setName', function () {
    it('returns an instance of NStrapModule', function () {
      current.setName('example').should.equal(current);
    });
  });

  describe('getName', function () {
    it('returns the name', function () {
      current.setName('example').getName().should.equal('example');
    });
  });

  describe('setTask', function () {
    it('returns an instance of NStrapModule', function () {
      current.setTask(function () {}).should.equal(current);
    });
  });

  describe('getTask', function () {
    it('returns the task', function () {
      function task() {}
      current.setTask(task).getTask().should.equal(task);
    });
  });

  describe('addDependency', function () {
    it('returns an instance of NStrapModule', function () {
      current.addDependency('current').should.equal(current);
    });

    it('accepts various arguments', function () {
      current.addDependency('hi', 'i', 'am', 'jon').getDependencies().should.have.length(4);
    });
  });

  describe('getDependencies', function () {
    it('returns an array of dependencies', function () {
      current.getDependencies().should.have.length(0);
    });
  });

  describe('setSupplier', function () {
    it('returns an instance of NStrapModule', function () {
      current.setSupplier(function () {}).should.equal(current);
    });
  });

  describe('getSupplier', function () {
    it('returns an array of functions', function () {
      function a() {}

      current.setSupplier(a);
      current.getSupplier().should.eql(a);
    });
  });

  describe('setResult', function () {
    it('returns an instance of NStrapModule', function () {
      current.setResult(new Promise(function () {})).should.equal(current);
    });
  });

  describe('getResult', function () {
    it('returns the result', function () {
      current.setResult(1);
      current.getResult().should.equal(1);
    });
  });

  describe('isValid', function () {
    it('throws an error if the name is invalid', function () {
      current
        .setName(1337)
        .isValid()
        .should.be.an.instanceof(Error)
      ;
    });

    it('throws an error if the task is invalid', function () {
      current
        .setName('example')
        .setTask(1337)
        .isValid()
        .should.be.an.instanceof(Error)
      ;
    });

    it('throws an error if the dependencies are invalid', function () {
      current
        .setName('example')
        .setTask(function () {})
        .addDependency(undefined)
        .isValid()
        .should.be.an.instanceof(Error)
      ;
    });

    it('throws an error if the supplier is invalid', function () {
      current
        .setName('example')
        .setTask(function () {})
        .addDependency('test')
        .setSupplier('fail')
        .isValid()
        .should.be.an.instanceof(Error)
      ;
    });
  });
});