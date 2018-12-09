const {
  validateResult,
  differentKindsTest,
  onePathTest,
  twoPathsTest,
  threePathsTest,
} = require('./shared')('windows');
const commonPathWindows = require('../').windows;

describe('commonPath.windows()', () => {
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
  it('Should return commonDir === null for absolute paths with different drive letters.', () => {
    const paths1 = ['C:\\file.js', 'D:\\file.js'];
    const paths2 = ['C:\\a\\file.js', 'D:\\a\\file.js'];
    validateResult(paths1, commonPathWindows(paths1), null);
    validateResult(paths2, commonPathWindows(paths2), null);
  });
  it('Should return commonDir === null for relative paths with different drive letters.', () => {
    const paths1 = ['C:file.js', 'D:file.js'];
    const paths2 = ['C:a\\file.js', 'D:a\\file.js'];
    validateResult(paths1, commonPathWindows(paths1), null);
    validateResult(paths2, commonPathWindows(paths2), null);
  });
  it('Should return commonDir === null for namespaced paths with different drive letters.', () => {
    const paths1 = ['\\\\?\\C:\\file.js', '\\\\?\\D:\\file.js'];
    const paths2 = ['\\\\?\\C:\\a\\file.js', '\\\\?\\D:\\a\\file.js'];
    const paths3 = ['\\\\.\\C:\\file.js', '\\\\.\\D:\\file.js'];
    const paths4 = ['\\\\.\\C:\\a\\file.js', '\\\\.\\D:\\a\\file.js'];
    validateResult(paths1, commonPathWindows(paths1), null);
    validateResult(paths2, commonPathWindows(paths2), null);
    validateResult(paths3, commonPathWindows(paths3), null);
    validateResult(paths4, commonPathWindows(paths4), null);
  });
  it('Should return commonDir === null for UNC paths with different shared folders.', () => {
    const paths1 = [
      '\\\\server\\share1\\file.js',
      '\\\\server\\share2\\file.js',
    ];
    const paths2 = [
      '\\\\server\\share1\\a\\file.js',
      '\\\\server\\share2\\a\\file.js',
    ];
    validateResult(paths1, commonPathWindows(paths1), null);
    validateResult(paths2, commonPathWindows(paths2), null);
  });
  it('Should return commonDir === null for namespaced UNC paths with different shared folders.', () => {
    const paths1 = [
      '\\\\?\\UNC\\server\\share1\\file.js',
      '\\\\?\\UNC\\server\\share2\\file.js',
    ];
    const paths2 = [
      '\\\\?\\UNC\\server\\share1\\a\\file.js',
      '\\\\?\\UNC\\server\\share2\\a\\file.js',
    ];
    validateResult(paths1, commonPathWindows(paths1), null);
    validateResult(paths2, commonPathWindows(paths2), null);
  });
});
