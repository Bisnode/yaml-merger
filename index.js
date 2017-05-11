'use strict';

const fs = require('fs');
const meow = require('meow');
const objectMapper = require('object-mapper');
const yaml = require('js-yaml');

const cli = meow(`
    Usage
      $ node index.js <source.yaml> <mapper.yaml> [output.yaml]

    Options
      -v          Verbose console logging
      -h, --help  Shows this help
`, {
  boolean: ['v']
});
if(cli.flags.h) {
  cli.showHelp();
}
if(cli.input.length < 2) {
  cli.showHelp();
}

const sourceFileName = cli.input[0];
const mapperFileName = cli.input[1];
if(cli.input[2]) {
  const outputFileName = cli.input[2];
} else {
  const outputFileName = undefined;
}


Promise.all([
  readYamlFile(sourceFileName),
  readYamlFile(mapperFileName)
])
.then(content => {
  const source = content[0],
        mapper = content[1];
  return validateMapper(mapper).then( () => { 
    return transformYaml(source, mapper)
  });
})
.then(result => {
  log(JSON.stringify(result));
})
.catch(console.error);

function log(text) {
  if(cli.flags.v) {
    console.log(text);
  }
}

function readYamlFile(fileName) {
  return new Promise((resolve, reject) => {
    log(`Reading ${fileName}`);
    resolve(yaml.safeLoad(fs.readFileSync(fileName, 'utf8')));
  });
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
    log(`validating map: ${jsonMap}`);

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
    log(`Could not find key '${map.from}' in source file.`);
  }
  return objectMapper(source, destination, {[map.from]: map.to});
}
