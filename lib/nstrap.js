'use strict';

var isString     = require('lodash.isstring'),
    isUndefined  = require('lodash.isundefined'),
    isFunction   = require('lodash.isfunction'),
    isObject     = require('lodash.isobject'),
    flatten      = require('lodash.flatten'),
    merge        = require('lodash.merge'),
    Promise      = require('bluebird'),
    EventEmitter = require('eventemitter3'),
    util         = require('util');

function NStrap(config) {
  this.config      = merge({ timeout: 2000 }, config);
  this.registry    = [];
  this.registryMap = {};
  this.runner      = null;

  EventEmitter.call(this);
}

util.inherits(NStrap, EventEmitter);

NStrap.prototype.add = NStrap.prototype.register = function add(name, depending, task) {
  if (this.runner) {
    throw new Error('NStrap instance already executed');
  }

  if (!isString(name)) {
    throw new Error(util.format('The obtained NStrap task "%s" name is not valid', name));
  }

  if (isUndefined(task)) {
    task      = depending;
    depending = [];
  }

  if (!isFunction(task)) {
    throw new Error('The provided task must be a function');
  }

  this.registry.push({
    name:      name,
    depending: depending,
    task:      task,
    result:    null
  });

  this.registryMap[name] = this.registry.length - 1;

  return this;
};

NStrap.prototype.get = function get(name) {
  if (!isString(name)) {
    throw new Error(util.format('The obtained NStrap task "%s" name is not valid', name));
  }

  return this.registry[this.registryMap[name]].result;
};

NStrap.prototype.run = NStrap.prototype.execute = function run() {
  var self = this,
      internalTimeout;

  if (this.runner) {
    return this.runner;
  }

  return (this.runner = new Promise(function (resolve, reject) {
    var stack = {};

    internalTimeout = setTimeout(function () {
      var err = new Error(util.format('Timeout of %d reached', self.config.timeout));

      self.registry.forEach(function (item) {
        if (item.result instanceof Promise && item.result.isCancellable()) {
          item.result.cancel(err);
        }
      });

      reject(err);
    }, self.config.timeout);

    self.registry.sort(function (a, b) {
      return a.depending.length > b.depending.length;
    });

    self.registry.forEach(function (item) {
      var action;

      item.result = new Promise(function (resolveResult, rejectResult) {
        self.on(item.name, function (result) {
          if (result instanceof Error) {
            return rejectResult(result);
          }

          resolveResult(result);
        });
      });

      function mapInjectable(injectable) {
        return self.get(injectable);
      }

      action = Promise.all(item.depending.map(mapInjectable))
        .then(function () {
          var args = flatten(Array.prototype.slice.call(arguments)),
              result;

          function done(arg) {
            self.emit(item.name, arg);
          }

          args.push(done);
          result = item.task.apply(item.task, args);

          if (result instanceof Promise) {
            result.then(done).catch(done);
          }

          return self.get(item.name);
        })
      ;

      stack[item.name] = action;
    });

    return Promise.props(stack)
      .then(resolve)
      .catch(reject)
      .finally(function () {
        clearTimeout(internalTimeout);
      })
    ;
  }));
};

module.exports = NStrap;