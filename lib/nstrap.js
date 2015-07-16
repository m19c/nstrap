'use strict';

var isString        = require('lodash.isstring'),
    isUndefined     = require('lodash.isundefined'),
    isFunction      = require('lodash.isfunction'),
    flatten         = require('lodash.flatten'),
    Promise         = require('bluebird'),
    EventEmitter    = require('eventemitter3'),
    util            = require('util'),
    NStrapInterface = require('./nstrap-interface');

function NStrap() {
  this.registry    = [];
  this.registryMap = {};
  this.runner      = null;

  EventEmitter.call(this);
}

util.inherits(NStrap, EventEmitter);

NStrap.prototype.addInterface = function addInterface(instance) {
  if (!(instance instanceof NStrapInterface)) {
    throw new Error(util.format('The passed argument "%s" is not an instance of NStrapInterface', instance));
  }

  this.registry.push(instance);
  this.registryMap[instance.getName()] = this.registry.length - 1;
  return this;
};

NStrap.prototype.add = function add(name, dependencies, task, suppliers) {
  var instance;

  if (this.runner) {
    throw new Error('NStrap instance already executed');
  }

  if (name instanceof NStrapInterface) {
    return this.addInterface(name);
  }

  if (!isString(name)) {
    throw new Error(util.format('The obtained NStrap task "%s" name is not valid', name));
  }

  if (isUndefined(task) && isUndefined(suppliers)) {
    task         = dependencies;
    dependencies = [];
  }

  if (!isFunction(task)) {
    throw new Error('The provided task must be a function');
  }

  instance = new NStrapInterface({
    name:         name,
    dependencies: dependencies || [],
    task:         task,
    suppliers:    suppliers
  });

  return this.addInterface(instance);
};

NStrap.prototype.get = function get(name) {
  if (!isString(name)) {
    throw new Error(util.format('The obtained NStrap task "%s" name is not valid', name));
  }

  return this.registry[this.registryMap[name]].getResult();
};

NStrap.prototype.run = NStrap.prototype.execute = function run() {
  var self = this;

  if (this.runner) {
    return this.runner;
  }

  return (this.runner = new Promise(function (resolve, reject) {
    var stack = {};

    self.registry.sort(function (a, b) {
      return a.getDependencies().length > b.getDependencies().length;
    });

    self.registry.forEach(function (item) {
      var action;

      item.setResult(new Promise(function (resolveResult, rejectResult) {
        self.on(item.getName(), function (result) {
          if (result instanceof Error) {
            return rejectResult(result);
          }

          resolveResult(result);
        });
      }));

      function mapDependencies(dependency) {
        return self.get(dependency);
      }

      action = Promise.all(item.getDependencies().map(mapDependencies))
        .then(function () {
          var args = flatten(Array.prototype.slice.call(arguments)),
              result;

          function done(arg) {
            self.emit(item.getName(), arg);
          }

          args.push(done);
          result = item.getTask().apply(item.getTask(), args);

          if (result instanceof Promise) {
            result.then(done).catch(done);
          }

          return self.get(item.getName());
        })
      ;

      stack[item.getName()] = action;
    });

    return Promise.props(stack)
      .then(resolve)
      .catch(reject)
    ;
  }));
};

module.exports = NStrap;