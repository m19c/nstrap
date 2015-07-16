'use strict';

var merge = require('lodash.merge');

function NStrapInterface(config) {
  this.config = merge({
    name:         null,
    task:         null,
    dependencies: [],
    suppliers:    [],
    result:       null
  }, config);
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

  this.config.deps.push.apply(this.config.deps, args);
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
};

module.exports = NStrapInterface;