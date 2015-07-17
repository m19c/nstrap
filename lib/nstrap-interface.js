'use strict';

var merge      = require('lodash.merge'),
    isString   = require('lodash.isstring'),
    // isFunction = require('lodash.isfunction'),
    // isArray    = require('lodash.isarray'),
    // assert     = require('assert'),
    util       = require('util');

function NStrapInterface(config) {
  this.config = merge({
    name:         null,
    task:         null,
    dependencies: [],
    suppliers:    [],
    result:       null
  }, config || {});
}

NStrapInterface.prototype.setName = function setName(name) {
  this.config.name = name;
  return this;
};

NStrapInterface.prototype.getName = function getName() {
  return this.config.name;
};

NStrapInterface.prototype.setTask = function setTask(task) {
  this.config.task = task;
  return this;
};

NStrapInterface.prototype.getTask = function getTask() {
  return this.config.task;
};

NStrapInterface.prototype.addDependency = function addDependency() {
  var args = Array.prototype.slice.call(arguments);

  this.config.dependencies.push.apply(this.config.dependencies, args);
  return this;
};

NStrapInterface.prototype.getDependencies = function getDependencies() {
  return this.config.dependencies;
};

NStrapInterface.prototype.addSupplier = function addSupplier() {
  var args = Array.prototype.slice.call(arguments);

  this.config.suppliers.push.apply(this.config.suppliers, args);
  return this;
};

NStrapInterface.prototype.getSuppliers = function getSuppliers() {
  return this.config.suppliers;
};

NStrapInterface.prototype.setResult = function setResult(result) {
  this.config.result = result;
  return this;
};

NStrapInterface.prototype.getResult = function getResult() {
  return this.config.result;
};

NStrapInterface.prototype.isValid = function isValid() {
  function generateError(message) {
    return new Error(util.format('%s: %s', 'NStrapInterface validation failed', message));
  }

  if (!isString(this.config.name)) {
    return generateError(util.format('The obtained name "%s" is not a string', this.config.name));
  }

  return true;
};

module.exports = NStrapInterface;