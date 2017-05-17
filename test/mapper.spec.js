'use strict'

require('basic-logger').setLevel('error', true);
const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
chai.should();

const mapper = require('../mapper');


const sourceFilePath = 'test/files/source.yaml';
const mapperFilePath = 'test/files/mapper.yaml';


describe("validateMapper", () => {

  const vaildMaps = [
    {
      from: 'test',
      to: 'test1'
    }, {
      from: 'musthave',
      to: 'test2',
      mandatory: true
    }, {
      from: 'nonMandatory',
      to: 'test3',
      static: 'this text will be used if from key is not found'
    }
  ];

  it("should pass valid map format", () => {
    return mapper.validateMapper(vaildMaps);
  });

  it("should reject if it is not an array", () => {
    return expect(
      mapper.validateMapper('')
    ).to.be.rejected;
  });

  it("should reject if missing 'from' key", () => {
    return expect(
      mapper.validateMapper([{to: 'only to'}])
    ).to.be.rejected;
  });

  it("should reject if missing 'to' key", () => {
    return expect(
      mapper.validateMapper([{from: 'only from'}])
    ).to.be.rejected;
  });

});

describe("transformYaml", () => {

  const sourceExample = {
    keyA: 'aValue',
    keyDeep: {
      a: 'deepA',
      b: 'deepB',
      cDeeper: {
        a: 'deeperA'
      }
    },
    keyArray: [ 'itemOne', 'itemTwo', 'itemThree' ]
  };

  it("should be able to transfer a simple key", () => {
    return mapper.transformYaml(
      sourceExample,
      [{from: 'keyA', to: 'newKeyA'}]
    ).should.become({newKeyA: 'aValue'});
  });

  it("should be able to transfer a deep key", () => {
    return mapper.transformYaml(
      sourceExample,
      [{from: 'keyDeep', to: 'newDeepKey'}]
    ).should.become({newDeepKey: sourceExample.keyDeep});
  });

  it("should be able to transfer an array", () => {
    return mapper.transformYaml(
      sourceExample,
      [{from: 'keyArray', to: 'newKeyArray'}]
    ).should.become({newKeyArray: sourceExample.keyArray});
  });

});

describe("readYamlFile", () => {

  it("should be able to read and parse a YAML file", () => {
    return mapper.readYamlFile(sourceFilePath);
  });

});
