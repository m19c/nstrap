var stripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
    argumentNames = /([^\s,]+)/g;

module.exports = function reflectFunction(action) {
  'use strict';

  var string = action.toString().replace(stripComments, ''),
      result = string.slice(string.indexOf('(') + 1, string.indexOf(')')).match(argumentNames);

  if (null === result) {
    result = [];
  }

  return result;
};