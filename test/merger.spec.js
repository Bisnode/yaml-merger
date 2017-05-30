'use strict'

require('basic-logger').setLevel('error', true);
const chai = require('chai').use(require('chai-as-promised'));
const fs = require('fs');
const expect = chai.expect;
chai.should();

const merger = require('../merger');


describe("mergeFiles", () => {

  const fileA = "test/testfileA.yaml"
  const fileB = "test/testfileB.yaml"
  const fileOutput = "test/testoutput1.yaml";
  const expectedOutput = {
    keyA: 'aValue',
    keyDeep: {
      a: "deepX",
      b: "deepB"
    },
    keyArray: [
      "itemOne",
      "itemTwo",
      3,
      "itemFour"
    ]
  };

  it("should merge and output to file", () => {
    return merger.mergeFiles(fileA, fileB, fileOutput)
      .then( () => {
        return merger._readYamlFile(fileOutput)
          .then(outputContent => {
            return outputContent.should.deep.equal(expectedOutput);
          });
      });
  });

  after( () => {
    fs.unlinkSync(fileOutput);
  })
});

describe("readYamlFile", () => {

  const testFileName = "test/testfileA.yaml"

  it("should read a Yaml file", () => {
    return merger._readYamlFile(testFileName);
  });

  it("should read the right content", () => {
    return merger._readYamlFile(testFileName).should.become({
      keyA: 'aValue',
      keyDeep: {
        a: "deepA",
        b: "deepB"
      },
      keyArray: [
        "itemOne",
        "itemTwo",
        3
      ]
    });
  });

});

describe("writeYamlFile", () => {

  const fileOutputName = "test/testoutput.yaml";

  it("should write a Yaml file", () => {
    return merger._writeYamlFile(fileOutputName, {keyA: 'test'});
  });

  after( () => {
    fs.unlinkSync(fileOutputName);
  })

});

describe("mergeObj", () => {
  const a = { keyA: 'someValue' };
  const b = { keyB: 123 };
  const c = { keyC: { keyC1: 1, keyC2: 2 }};
  const l1 = ['listItem11', 'listItem12'];
  const l2 = [21, 22];

  it("merge a obj with keys", () => {
    return merger._mergeObj(a, b).should.deep.equal({
      keyA: a.keyA,
      keyB: b.keyB
    });
  });

  it("merge a obj with keys withing keys", () => {
    return merger._mergeObj(a, c).should.deep.equal({
      keyA: a.keyA,
      keyC: c.keyC
    });
  });

  it("merge two lists", () => {
    return merger._mergeObj(l1, l2).should.deep.equal(
      l1.concat(l2)
    );
  });

  it("merge complex key and list mix", () => {
    return merger._mergeObj({
      deepKeyA: a,
      aList: l1
    }, {
      deepKeyB: b,
      aList: l2
    }).should.deep.equal({
      deepKeyA: a,
      deepKeyB: b,
      aList: l1.concat(l2)
    });
  });

  it("merge complex list with keys", () => {
    return merger._mergeObj({
      aList: [
        {
          keyA: a.keyA,
          deeperList: [1, 2],
          otherList: ['x']
        },
        {
          keyB: b.keyB,
          otherList: ['y']
        }
      ]
    }, {
      aList: [
        {
          keyA: a.keyA,
          deeperList: [3, 4]
        },
        {
          otherList: ['z']
        }
      ]
    }).should.deep.equal({
      aList: [
        {
          keyA: a.keyA,
          deeperList: [1, 2, 3, 4],
          otherList: ['x']
        },
        {
          keyB: b.keyB,
          otherList: ['y', 'z']
        }
      ]
    });
  });

});
