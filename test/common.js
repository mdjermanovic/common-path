const { expect } = require('chai');
const { permutation } = require('js-combinatorics');
const commonPath = require('../');

/*
 *  Detailed tests are in posix.js and windows.js suites
 *  comonPath() on posix platforms works like commonPath.posix()
 *  comonPath() on windows platforms works like commonPath.windows()
 */

describe('commonPath()', () => {
  it('Should work well on arrays that contain only strings', () => {
    expect(commonPath(['a.js', 'b.js'])).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [
        {
          original: 'a.js',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
        {
          original: 'b.js',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'b.js',
          namePart: 'b',
          extPart: '.js',
        },
      ],
    });
  });
  it('Should work well on arrays that contain only objects', () => {
    const o1 = { filePath: 'a.js' };
    const o2 = { filePath: 'b.js' };
    const result = commonPath([o1, o2], 'filePath');
    expect(result).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [
        {
          original: o1,
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
        {
          original: o2,
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'b.js',
          namePart: 'b',
          extPart: '.js',
        },
      ],
    });
    // by reference
    expect(result.parsedPaths[0].original).to.equal(o1);
    expect(result.parsedPaths[1].original).to.equal(o2);
  });
  it('Should work well on arrays that contain both strings and objects', () => {
    const o1 = { filePath: 'a.js' };
    const result = commonPath([o1, 'b.js'], 'filePath');
    expect(result).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [
        {
          original: o1,
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
        {
          original: 'b.js',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'b.js',
          namePart: 'b',
          extPart: '.js',
        },
      ],
    });
    // by reference
    expect(result.parsedPaths[0].original).to.equal(o1);
  });
  it('Should work well with an empty string path', () => {
    expect(commonPath([''])).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [
        {
          original: '',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: '',
          namePart: '',
          extPart: '',
        },
      ],
    });
  });
  it('Should work well with an empty string path and another relative path', () => {
    const path1 = '';
    const path2 = 'a.js';
    const parsed1 = {
      original: '',
      subdir: '',
      commonPart: '',
      subPart: '',
      basePart: '',
      namePart: '',
      extPart: '',
    };
    const parsed2 = {
      original: 'a.js',
      subdir: '',
      commonPart: '',
      subPart: '',
      basePart: 'a.js',
      namePart: 'a',
      extPart: '.js',
    };
    expect(commonPath([path1, path2])).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [parsed1, parsed2],
    });
    expect(commonPath([path2, path1])).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [parsed2, parsed1],
    });
  });
  it('Should, when empty array passed, return null values and empty array parsedPaths', () => {
    expect(commonPath([])).to.deep.equal({
      commonRoot: null,
      commonDir: null,
      parsedPaths: [],
    });
  });
  it('Should throw if paths is not an array', () => {
    expect(() => commonPath()).to.throw(TypeError);
    expect(() => commonPath(null)).to.throw(TypeError);
    expect(() => commonPath('a')).to.throw(TypeError);
    expect(() => commonPath(5)).to.throw(TypeError);
  });
  it('Should throw if paths contains elements that are not strings or objects', () => {
    expect(() => commonPath([5])).to.throw(TypeError);
    expect(() => commonPath(['', 5])).to.throw(TypeError);
    expect(() => commonPath([null])).to.throw(TypeError);
    expect(() => commonPath(['', null])).to.throw(TypeError);
    expect(() => commonPath([undefined])).to.throw(TypeError);
    expect(() => commonPath(['', undefined])).to.throw(TypeError);
  });
  it('Should throw if pathKey is not a string or undefined', () => {
    expect(() => commonPath(['a'], 5)).to.throw(TypeError);
    expect(() => commonPath(['a'], null)).to.throw(TypeError);
  });
  it('Should ignore pathKey if paths array contains only strings', () => {
    expect(commonPath(['a.js', 'b.js'], 'filePath')).to.deep.equal({
      commonRoot: '',
      commonDir: '',
      parsedPaths: [
        {
          original: 'a.js',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
        {
          original: 'b.js',
          subdir: '',
          commonPart: '',
          subPart: '',
          basePart: 'b.js',
          namePart: 'b',
          extPart: '.js',
        },
      ],
    });
  });
  it('Should throw if paths contain objects, but pathKey is not defined', () => {
    expect(() => commonPath([{}])).to.throw(TypeError);
    expect(() => commonPath(['', {}])).to.throw(TypeError);
    expect(() => commonPath([{}, ''])).to.throw(TypeError);
  });
  it('Should throw if paths contain objects without pathKey property', () => {
    expect(() => commonPath([{}], 'filePath')).to.throw(TypeError);
  });
  it('Should throw if paths contain objects with pathKey value that is not a string', () => {
    expect(() => commonPath([{ filePath: 5 }], 'filePath')).to.throw(TypeError);
    expect(() => commonPath([{ filePath: null }], 'filePath')).to.throw(
      TypeError
    );
    expect(() => commonPath([{ filePath: {} }], 'filePath')).to.throw(
      TypeError
    );
  });
  it('Should treat strings and objects equally', () => {
    const o1 = { filePath: '/a/b/c/file1.js' };
    const o2 = { filePath: '/a/file2.js' };
    const ary = [
      {
        path: o1,
        parsedPath: {
          original: o1,
          subdir: 'b/c',
          commonPart: '/a/',
          subPart: 'b/c/',
          basePart: 'file1.js',
          namePart: 'file1',
          extPart: '.js',
        },
      },
      {
        path: '/a/d/file3.js',
        parsedPath: {
          original: '/a/d/file3.js',
          subdir: 'd',
          commonPart: '/a/',
          subPart: 'd/',
          basePart: 'file3.js',
          namePart: 'file3',
          extPart: '.js',
        },
      },
      {
        path: o2,
        parsedPath: {
          original: o2,
          subdir: '',
          commonPart: '/a/',
          subPart: '',
          basePart: 'file2.js',
          namePart: 'file2',
          extPart: '.js',
        },
      },
    ];

    permutation(ary)
      .toArray()
      .forEach(perm => {
        const paths = perm.map(item => item.path);
        const parsedPaths = perm.map(item => item.parsedPath);
        expect(commonPath.posix(paths, 'filePath')).to.deep.equal({
          commonRoot: '/',
          commonDir: '/a',
          parsedPaths,
        });
      });
  });
});
