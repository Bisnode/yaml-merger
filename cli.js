'use strict';


const merger = require('./merger');
const meow = require('meow');
const Logger = require('basic-logger');
Logger.setLevel('error', true);
const log = new Logger();

const cli = meow(`
    Usage
      $ node index.js <fileA.yaml> <fileB.yaml> [output.yaml]

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

const fileAName = cli.input[0];
const fileBName = cli.input[1];
let outputFileName = undefined;
if(cli.input[2]) {
  outputFileName = cli.input[2];
}

merger.mergeFiles(fileAName, fileBName, outputFileName)
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
