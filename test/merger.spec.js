'use strict'

require('basic-logger').setLevel('error', true);
const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
chai.should();

const merger = require('../merger');


describe("merge", () => {
  const a = { keyA: 'someValue' };
  const b = { keyB: 123 };
  const c = { keyC: { keyC1: 1, keyC2: 2 }};
  const l1 = ['listItem11', 'listItem12'];
  const l2 = [21, 22];

  it("merge a obj with keys", () => {
    return merger.merge(a, b).should.deep.equal({
      keyA: a.keyA,
      keyB: b.keyB
    });
  });

  it("merge a obj with keys withing keys", () => {
    return merger.merge(a, c).should.deep.equal({
      keyA: a.keyA,
      keyC: c.keyC
    });
  });

  it("merge two lists", () => {
    return merger.merge(l1, l2).should.deep.equal(
      l1.concat(l2)
    );
  });

  it("merge complex key and list mix", () => {
    return merger.merge({
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
    return merger.merge({
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
