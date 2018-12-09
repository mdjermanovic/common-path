const { expect } = require('chai');
const commonPath = require('../');
const shared = require('./shared');

describe('Readme examples', () => {
  it('Should work well for readme example #1', () => {
    const paths = [
      '/projects/myapp/src/util/one.js',
      '/projects/myapp/test/fixtures/two.js',
    ];

    const common = commonPath.posix(paths);

    expect(common).to.deep.equal({
      commonRoot: '/',
      commonDir: '/projects/myapp',
      parsedPaths: [
        {
          original: '/projects/myapp/src/util/one.js',
          subdir: 'src/util',
          commonPart: '/projects/myapp/',
          subPart: 'src/util/',
          basePart: 'one.js',
          namePart: 'one',
          extPart: '.js',
        },
        {
          original: '/projects/myapp/test/fixtures/two.js',
          subdir: 'test/fixtures',
          commonPart: '/projects/myapp/',
          subPart: 'test/fixtures/',
          basePart: 'two.js',
          namePart: 'two',
          extPart: '.js',
        },
      ],
    });
  });

  it('Should work well for readme example #2', () => {
    const obj1 = { filePath: 'C:\\lib\\hash.js' };
    const obj2 = { filePath: 'C:\\lib\\encode\\url.js' };

    const paths = [obj1, obj2];

    const common = commonPath.windows(paths, 'filePath');

    expect(common).to.deep.equal({
      commonRoot: 'C:\\',
      commonDir: 'C:\\lib',
      parsedPaths: [
        {
          original: obj1, // reference to the same object
          subdir: '',
          commonPart: 'C:\\lib\\',
          subPart: '',
          basePart: 'hash.js',
          namePart: 'hash',
          extPart: '.js',
        },
        {
          original: obj2, // reference to the same object
          subdir: 'encode',
          commonPart: 'C:\\lib\\',
          subPart: 'encode\\',
          basePart: 'url.js',
          namePart: 'url',
          extPart: '.js',
        },
      ],
    });
  });

  it('Should work well for readme example #3', () => {
    const paths = ['C:\\a.js', 'D:\\a.js'];

    const common = commonPath.windows(paths);

    expect(common).to.deep.equal({
      commonRoot: null,
      commonDir: null,
      parsedPaths: [
        {
          original: 'C:\\a.js',
          subdir: null,
          commonPart: '',
          subPart: 'C:\\',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
        {
          original: 'D:\\a.js',
          subdir: null,
          commonPart: '',
          subPart: 'D:\\',
          basePart: 'a.js',
          namePart: 'a',
          extPart: '.js',
        },
      ],
    });
  });
  it('Should work well for inline examples', () => {
    const commonPathPosix = commonPath.posix;
    const commonPathWindows = commonPath.windows;
    const { validateResult: validateResultPosix } = shared('posix');
    const { validateResult: validateResultWindows } = shared('windows');

    const paths1 = ['C:\\a.js', 'D:\\a.js'];
    validateResultWindows(paths1, commonPathWindows(paths1), null);
    const paths2 = ['\\\\server\\share\\a.js', '\\b.js'];
    validateResultWindows(paths2, commonPathWindows(paths2), null);
    const paths3 = ['\\\\server\\share1\\a.js', '\\\\server\\share2\\b.js'];
    validateResultWindows(paths3, commonPathWindows(paths3), null);
    const paths4 = ['C:a.js', 'C:\\b.js'];
    validateResultWindows(paths4, commonPathWindows(paths4), null);
    const paths5 = ['C:a.js', 'C:b.js'];
    validateResultWindows(paths5, commonPathWindows(paths5), 'C:');
    const paths6 = ['\\\\?\\C:\\a.js', '\\\\?\\D:\\b.js'];
    validateResultWindows(paths6, commonPathWindows(paths6), null);
    const paths7 = ['\\a.js', '\\b.js'];
    validateResultPosix(paths7, commonPathPosix(paths7), '');
    const paths8 = ['D:\\a\\b.js', '\\a\\b.js', 'a\\b.js'];
    validateResultWindows(paths8, commonPathWindows(paths8), null);
    const paths9 = ['/projects/myapp', '/projects/myapp/test'];
    validateResultPosix(paths9, commonPathPosix(paths9), '/projects');
  });
});
