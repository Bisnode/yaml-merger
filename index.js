'use strict';

const fs   = require('fs');
const meow = require('meow');
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
  return transformYaml(content[0], content[1]);
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

function transformYaml(source, mapper) {
  return new Promise((resolve, reject) => {
    log('transformYaml started');
    var destination = {};
    mapper.forEach((map, index) => {
      isVaildMap(map)
        .then(() => {
          return mapValue(source, map, destination);
        })
        .then(newDest => {
          destination = newDest;
        })
        .catch(err => {
          reject(`Error when mapping item nr ${index+1}: ${err}`);
        });
    });
  });
}

function isVaildMap(map) {
  return new Promise((resolve, reject) => {
    if(typeof map.to == undefined) {
      reject(`"to" is not defined`);
    }
    if(typeof map.from == undefined) {
      reject(`from is not defined`);
    }
    resolve(map);
  });
}

function mapValue(source, map, destination) {
  return new Promise((resolve, reject) => {
    destination[map.to] = source[map.from];
    resolve(destination);
  });
}
