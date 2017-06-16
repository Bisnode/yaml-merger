'use strict';

const deepmerge = require('deepmerge');
const fs = require('fs');
const jsYaml = require('js-yaml');
const Logger = require('basic-logger');
const log = new Logger();

module.exports = {
  mergeFiles: mergeFiles,
  _mergeObj: mergeObj,
  _readYamlFile: readYamlFile,
  _writeYamlFile: writeYamlFile
}

function mergeObj(objA, objB) {
  return deepmerge(objA, objB);
}

function mergeFiles(fileAName, fileBName, options) {
  return Promise.all([
    readYamlFile(fileAName),
    readYamlFile(fileBName)
  ])
  .then(content => {
    if(options.mergePath) {
      var newContext = {}
      var rootContext = newContext;
      var pathArray = options.mergePath.split('.');
      pathArray.forEach((p, index) => {
        if(index < pathArray.length - 1) {
          newContext[p] = {};
          newContext = newContext[p];
        } else {
          newContext[p] = content[1];
        }
      })
      return mergeObj(content[0], rootContext);
    }
    else {
      return mergeObj(content[0], content[1]);
    }
  })
  .then(result => {
    if(options.outputFileName) {
      writeYamlFile(options.outputFileName, result);
    } else {
      console.log(jsYaml.safeDump(result));
    }
    log.info(JSON.stringify(result));
  });
}

function readYamlFile(fileName) {
  return new Promise((resolve, reject) => {
    log.info(`Reading ${fileName}`);
    resolve(jsYaml.safeLoad(fs.readFileSync(fileName, 'utf8')));
  });
}

function writeYamlFile(fileName, data) {
  return new Promise((resolve, reject) => {
    log.info(`Writing ${fileName}`);
    resolve(fs.writeFileSync(fileName, jsYaml.safeDump(data), 'utf8'));
  });
}
