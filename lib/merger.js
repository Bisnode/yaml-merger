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
      log.info(`mergePath: ${options.mergePath}`);
      let newContext = {}
      let rootContext = newContext;
      let pathArray = options.mergePath.split('.');
      pathArray.forEach((p, index) => {
        if( ! isNaN(p)) {
          p = parseInt(p);
        }
        newContext[p] = _getNewMapOrArray(pathArray, index);
        newContext = newContext[p];
      });
      Object.assign(newContext, content[1]);
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

function _getNewMapOrArray(pathArray, index) {
  log.debug(`_getNewMapOrArray: ${index}`);
  if(index == pathArray.length - 1) {
    return {};
  }
  const nextValue = pathArray[index+1];
  if( ! isNaN( nextValue )) {
    log.info(`Found number ${nextValue} in mergePath at pos ${index+1}. Will interpret '${pathArray[index]}' as array.`);
    return new Array(parseInt(nextValue)+1);
  }
  return {}
}
