const lib = require('../../../../../../../../lib/lib.js');

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
  readFileSync: (path) => {
    mockpushit({ readFileSyncFromPath: path });
    return `{ "name": "x", "scripts": { "test": "exit 1" } }`;
  },
  writeFileSync: (path, json, options) => {
    mockpushit({ writeFileSyncToPath: path, json, options });
  },
}));
jest.mock('execa', () => ({
  commandSync: (command, options) => {
    mockpushit({ commandSync: command, options });
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

test('create alice-bobbi module using mocked lib with logging, with example, with prefix: null', async () => {
  const options = {
    name: 'alice-bobbi',
    prefix: null,
    generateExample: true,
  };

  await lib(options);

  expect(mysnap).toMatchSnapshot();
});
