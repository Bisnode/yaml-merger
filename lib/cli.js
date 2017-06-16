'use strict';


const merger = require('./merger');
const meow = require('meow');
const Logger = require('basic-logger');
Logger.setLevel('error', true);
const log = new Logger();

const cli = meow(`
    Usage
      $ yaml-merger -i <fileA.yaml> -i <fileB.yaml> [-o output.yaml]

    Options
      -i, --input  Input files, define 2
      -o, --output Output file, if omited outputs to console
      --mergePath  Change root path in first file to be merged in
      -v           Verbose console logging
      -h, --help   Shows this help
`, {
  boolean: ['v'],
  alias: {
    i: 'input',
    o: 'output'
  }
});

if(cli.flags.h || cli.flags.input.length < 2) {
  cli.showHelp();
  return;
}

if(cli.flags.v) {
  Logger.setLevel('debug');
}

const fileAName = cli.flags.input[0];
const fileBName = cli.flags.input[1];
let outputFileName = undefined;
if(cli.flags.output) {
  outputFileName = cli.flags.output;
}

merger.mergeFiles(fileAName, fileBName, {outputFileName: outputFileName, mergePath: cli.flags.mergePath})
  .catch(err => {
    log.error(err);
    process.exit(1);
  });
