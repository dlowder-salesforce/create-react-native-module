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
    mockpushit({ command, options });
    if (/yarn add/.test(command)) {
      throw new Error('ENOPERM not permitted');
    }
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
  error: (...args) => {
    mockpushit({ error: [].concat(args) });
  },
};

test('create alice-bobbi module using mocked lib with config options, with example, yarn failure with console logging', async () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    generateExample: true,
  };

  let error;
  try {
    // expected to throw:
    await lib(options);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(/ENOPERM not permitted/);
  expect(mysnap).toMatchSnapshot();
});
