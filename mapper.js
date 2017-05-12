'use strict';

const fs = require('fs');
const objectMapper = require('object-mapper');
const yaml = require('js-yaml');
const Logger = require('basic-logger');
const log = new Logger();

module.exports = {
  validateMapper: validateMapper,
  transformYaml: transformYaml,
  readYamlFile: readYamlFile
}

function validateMapper(mapper) {
  if ( ! Array.isArray(mapper)) {
    const content = JSON.stringify(mapper);
    return Promise.reject(`Mapper object is not an array. (it's content: ${content} )`);
  }

  var mapItemPromises = [];
  mapper.forEach((map, index) => {
    mapItemPromises.push(isValidMap(map));
  });
  return Promise.all(mapItemPromises);
}

function transformYaml(source, mapper) {
  return new Promise((resolve, reject) => {
    var output = {};
    mapper.forEach((map, index) => {
      output = mapValue(source, map, output);
    });
    resolve(output);
  });
}

function isValidMap(map) {
  return new Promise((resolve, reject) => {
    const jsonMap = JSON.stringify(map);
    log.info(`validating map: ${jsonMap}`);

    ['to', 'from'].forEach( required => {
      if( ! required in map) {
        reject(`'${required}' is not defined in map: ${jsonMap}`);
      }
    });

    resolve(map);
  });
}

function mapValue(source, map, destination = {}) {
  if( ! map.from in source) {
    log.warn(`Could not find key '${map.from}' in source file.`);
  }
  return objectMapper(source, destination, {[map.from]: map.to});
}

function readYamlFile(fileName) {
  return new Promise((resolve, reject) => {
    log.info(`Reading ${fileName}`);
    resolve(yaml.safeLoad(fs.readFileSync(fileName, 'utf8')));
  });
}
