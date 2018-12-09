const { expect } = require('chai');
const {
  cartesianProduct,
  combination,
  permutation,
} = require('js-combinatorics');
const commonPathLib = require('../');
const NodePath = require('path');
const UPath = require('upath');

const commonPathFunction = {
  posix: commonPathLib.posix,
  windows: commonPathLib.windows,
  upath: function(...args) {
    return commonPathLib.custom(UPath, ...args);
  },
};

const platformPath = {
  posix: NodePath.posix,
  windows: NodePath.win32,
  upath: UPath,
};

const platformRoots = {
  posix: ['/', ''],
  windows: [
    'C:\\',
    '\\',
    '',
    'C:',
    '\\\\server\\share\\',
    '\\\\?\\C:\\',
    '\\\\.\\C:\\',
  ],
  upath: ['/', ''],
};

const platformRootSufixes = {
  posix: ['', 'dir1/', 'dir1/dir2/', 'dir1/dir2/dir1/'],
};
platformRootSufixes.windows = platformRootSufixes.posix.map(s =>
  s.replace(/\//g, '\\')
);
platformRootSufixes.upath = platformRootSufixes.posix;

function factory(platform) {
  const commonPath = commonPathFunction[platform];
  const Path = platformPath[platform];
  const roots = platformRoots[platform];
  const rootSufixes = platformRootSufixes[platform];
  const prefixes = cartesianProduct(roots, rootSufixes)
    .toArray()
    .map(([root, rootSufix]) => root + rootSufix);

  function validateResult(
    paths,
    { commonRoot, commonDir, parsedPaths },
    expectedCommonDir
  ) {
    expect(commonDir).to.equal(expectedCommonDir);
    if (commonDir === null) {
      expect(commonRoot).to.be.null;
    } else {
      expect(commonDir.startsWith(commonRoot)).to.be.true;
    }
    expect(parsedPaths.length).to.equal(paths.length);
    parsedPaths.forEach(
      (
        { original, subdir, commonPart, subPart, basePart, namePart, extPart },
        index
      ) => {
        expect(original).to.equal(paths[index]);

        const { root, dir, name, base, ext } = Path.parse(original);

        if (commonDir === null) {
          expect(subdir).to.be.null;
          expect(commonPart).to.equal('');
        } else {
          expect(Path.relative(commonDir, dir)).to.equal(subdir);
          expect(root).to.equal(commonRoot);
          expect(dir.startsWith(commonDir)).to.be.true;
          expect(commonPart.startsWith(commonDir)).to.be.true;
          expect(commonPart.endsWith(`${Path.sep}${Path.sep}`)).to.be.false;
          if (commonPart.length !== commonDir.length) {
            expect(commonPart.length).to.equal(commonDir.length + 1);
            expect(commonPart[commonPart.length - 1]).to.equal(Path.sep);
          }
        }

        expect(commonPart + subPart + basePart).to.equal(original);
        expect(basePart).to.equal(base);
        expect(namePart).to.equal(name);
        expect(extPart).to.equal(ext);
        expect(namePart + extPart).to.equal(basePart);
      }
    );
  }

  function differentKindsTest() {
    const allByRoot = roots.map(root =>
      rootSufixes.map(sufix => root + sufix + 'file.js')
    );
    const testCases = combination(allByRoot, 2)
      .toArray()
      .reduce((acc, value) => {
        acc.push(...permutation(value).toArray());
        return acc;
      }, [])
      .reduce((acc, value) => {
        acc.push(...cartesianProduct(...value).toArray());
        return acc;
      }, []);
    testCases.forEach(paths => validateResult(paths, commonPath(paths), null));
  }

  function onePathTest() {
    const testCases = cartesianProduct(prefixes, [
      'file.js',
      'file',
      '.js',
      'dir1',
    ])
      .toArray()
      .map(([prefix, file]) => [prefix + file]);
    testCases.forEach(paths =>
      validateResult(paths, commonPath(paths), Path.parse(paths[0]).dir)
    );
  }

  function testWithAllPrefixes(paths, expectedCommonSubDir) {
    paths = paths.map(path => path.replace('/', Path.sep));
    expectedCommonSubDir = expectedCommonSubDir.replace('/', Path.sep);

    permutation(paths)
      .toArray()
      .forEach(p =>
        prefixes.forEach(prefix => {
          const testCase = p.map(path => prefix + path);
          let expectedCommonDir = prefix + expectedCommonSubDir;
          if (
            expectedCommonSubDir === '' &&
            prefix.endsWith(Path.sep) &&
            roots.indexOf(prefix) < 0
          ) {
            expectedCommonDir = expectedCommonDir.slice(0, -1);
          }
          validateResult(testCase, commonPath(testCase), expectedCommonDir);
        })
      );
  }

  function twoPathsTest() {
    testWithAllPrefixes(['file1.js', 'file2.js'], '');
    testWithAllPrefixes(['file', 'file'], '');
    testWithAllPrefixes(['dir1', 'dir1'], '');
    testWithAllPrefixes(['dir2', 'dir2'], '');
    testWithAllPrefixes(['file1', 'a/file2'], '');
    testWithAllPrefixes(['a/file1', 'b/file2'], '');
    testWithAllPrefixes(['a/file1', 'a/b/file2'], 'a');
    testWithAllPrefixes(['file1', 'a/b/file2'], '');
    testWithAllPrefixes(['a/b/file1', 'c/d/file2'], '');
    testWithAllPrefixes(['a/b/file1', 'a/c/file2'], 'a');
    testWithAllPrefixes(['a/a/file1', 'a/a/file2'], 'a/a');
    testWithAllPrefixes(['a/a/file1', 'a/file2'], 'a');
  }

  function threePathsTest() {
    testWithAllPrefixes(['file1.js', 'file2.js', 'file3.js'], '');
    testWithAllPrefixes(['file', 'file', 'file'], '');
    testWithAllPrefixes(['a/file1', 'file2', 'file3'], '');
    testWithAllPrefixes(['a/file1', 'a/file2', 'file3'], '');
    testWithAllPrefixes(['a/b/file1', 'a/b/file2', 'a/file3'], 'a');
    testWithAllPrefixes(['a/b/file1', 'a/b/file2', 'a/c/file3'], 'a');
    testWithAllPrefixes(['a/file1', 'b/file2', 'c/file3'], '');
    testWithAllPrefixes(['a/d/file1', 'b/d/file2', 'c/d/file3'], '');
  }

  return {
    validateResult,
    differentKindsTest,
    onePathTest,
    twoPathsTest,
    threePathsTest,
  };
}

module.exports = factory;
