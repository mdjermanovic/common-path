const {
  differentKindsTest,
  onePathTest,
  twoPathsTest,
  threePathsTest,
} = require('./shared')('posix');

describe('commonPath.posix()', () => {
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
