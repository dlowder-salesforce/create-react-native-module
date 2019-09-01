const lib = require('../../lib/lib.js');

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({ outputFileName, theContent });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir });
    return Promise.resolve();
  },
  readFile: (path, _, cb) => {
    mockpushit({ readFileFromPath: path });
    cb(null, `{ "name": "x", "scripts": { "test": "exit 1" } }`);
  },
  writeFileSync: (path, json, options) => {
    mockpushit({ writeFileSyncToPath: path, json, options });
  },
}));
jest.mock('execa', () => ({
  command: (command, options) => {
    mockpushit({ command: command, options });
    return Promise.resolve();
  }
}));

// TBD hackish mock:
global.console = {
  info: (...args) => {
    mockpushit({ info: [].concat(args) });
  },
  log: (...args) => {
    mockpushit({ log: [].concat(args) });
  },
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
};

test('create alice-bobbi module using mocked lib with config options, with exampe, for Android and iOS including console logging', () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
  };

  return lib(options)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
