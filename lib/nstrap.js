'use strict';

var isUndefined     = require('lodash.isundefined'),
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

  if (isFunction(instance.getSupplier())) {
    instance.getSupplier()(this);
  }

  this.registry.push(instance);
  this.registryMap[instance.getName()] = this.registry.length - 1;
  return this;
};

NStrap.prototype.add = function add(name, dependencies, task, supplier) {
  var instance;

  if (name instanceof NStrapInterface) {
    return this.addInterface(name);
  }

  if (isUndefined(task) && isUndefined(supplier)) {
    task         = dependencies;
    dependencies = [];
  }

  instance = new NStrapInterface({
    name:         name,
    dependencies: dependencies || [],
    task:         task,
    supplier:     supplier
  });

  return this.addInterface(instance);
};

NStrap.prototype.get = function get(name) {
  return this.registry[this.registryMap[name]];
};

NStrap.prototype.run = NStrap.prototype.execute = function run() {
  var self = this,
      index, item, action, isValid;

  if (this.runner) {
    return this.runner;
  }

  return (this.runner = new Promise(function (resolve, reject) {
    var stack = {};

    self.registry.sort(function (a, b) {
      return a.getDependencies().length > b.getDependencies().length;
    });

    function mapDependencies(dependency) {
      return self.get(dependency).getResult();
    }

    function awaitInterfaceResult(entity) {
      return new Promise(function (resolveResult, rejectResult) {
        self.on(entity.getName(), function (result) {
          if (result instanceof Error) {
            return rejectResult(result);
          }

          resolveResult(result);
        });
      });
    }

    function broadcastInterfaceResult(entity) {
      return function () {
        var args = flatten(Array.prototype.slice.call(arguments)),
            result;

        function done(arg) {
          self.emit(entity.getName(), arg);
        }

        args.push(done);
        result = entity.getTask().apply(entity.getTask(), args);

        if (result instanceof Promise) {
          result.then(done).catch(done);
        }

        return self.get(entity.getName()).getResult();
      };
    }

    for (index = 0; index < self.registry.length; index++) {
      item    = self.registry[index];
      action  = undefined;
      isValid = undefined;

      if (true !== (isValid = item.isValid())) {
        return reject(isValid);
      }

      item.setResult(awaitInterfaceResult(item));

      action = Promise
        .all(item.getDependencies().map(mapDependencies))
        .then(broadcastInterfaceResult(item))
      ;

      stack[item.getName()] = action;
    }

    return Promise.props(stack)
      .then(resolve)
      .catch(reject)
    ;
  }));
};

module.exports = NStrap;