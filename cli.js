'use strict';

const m = require('./mapper');
const meow = require('meow');
const Logger = require('basic-logger');

const cli = meow(`
    Usage
      $ node index.js <source.yaml> <mapper.yaml> [output.yaml]

    Options
      -v          Verbose console logging
      -h, --help  Shows this help
`, {
  boolean: ['v']
});


if(cli.flags.h || cli.input.length < 2) {
  cli.showHelp();
  return;
}

if(cli.flags.v) {
  Logger.setLevel('debug');
}

const sourceFileName = cli.input[0];
const mapperFileName = cli.input[1];
if(cli.input[2]) {
  const outputFileName = cli.input[2];
} else {
  const outputFileName = undefined;
}


Promise.all([
  m.readYamlFile(sourceFileName),
  m.readYamlFile(mapperFileName)
])
.then(content => {
  const source = content[0],
        mapper = content[1];
  return m.validateMapper(mapper)
    .then( () => {
      return m.transformYaml(source, mapper)
    }
  );
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
