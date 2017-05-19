'use strict';

const jsYaml = require('js-yaml');
const m = require('./mapper');
const meow = require('meow');
const Logger = require('basic-logger');
Logger.setLevel('error', true);
const log = new Logger();

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
let outputFileName = undefined;
if(cli.input[2]) {
  outputFileName = cli.input[2];
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
  if(outputFileName) {
    //write yaml to file
  } else {
    console.log(jsYaml.safeDump(result));
  }
  log.info(JSON.stringify(result));
})
.catch(console.error);
