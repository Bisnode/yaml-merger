'use strict';

const deepmerge = require('deepmerge');
const Logger = require('basic-logger');
const log = new Logger();

module.exports = {
  merge: merge
}

function merge(objA, objB) {
  return deepmerge(objA, objB);
}
