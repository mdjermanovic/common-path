const { expect } = require('chai');
const commonPathCustom = require('../').custom;
const {
  differentKindsTest,
  onePathTest,
  twoPathsTest,
  threePathsTest,
} = require('./shared')('upath');

describe('commonPath.custom()', () => {
  it('Should throw if Path does not implement parse() and sep', () => {
    expect(() => commonPathCustom(null, ['a'])).to.throw(TypeError);
    expect(() => commonPathCustom(undefined, ['a'])).to.throw(TypeError);
    expect(() => commonPathCustom({}, ['a'])).to.throw(TypeError);
    expect(() => commonPathCustom({ parse() {} }, ['a'])).to.throw(TypeError);
    expect(() => commonPathCustom({ sep: '/' }, ['a'])).to.throw(TypeError);
  });
  it('Should return commonDir === null for different kinds of paths (multiple tests)', () => {
    differentKindsTest();
  });
  it('Should work well with 1-length arrays (multiple tests)', () => {
    onePathTest();
  });
  it('Should work well with 2-length arrays (multiple tests)', () => {
    twoPathsTest();
  });
  it('Should work well with 3-length arrays (multiple tests)', () => {
    threePathsTest();
  });
});
