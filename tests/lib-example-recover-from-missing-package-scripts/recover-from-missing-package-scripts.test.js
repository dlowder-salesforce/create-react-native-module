const lib = require('../../lib/lib.js');

const ioMocks = require('../helpers/io-mocks.js');

test('create alice-bobbi module with defaults, recover from missing scripts in example package.json', () => {
  const mysnap = [];

  const ioInject = ioMocks(mysnap);
  const ioInjected = {
    ...ioInject,
    fs: {
      ...ioInject.fs,
      readFileSync: (jsonFilePath) => {
        mysnap.push({
          call: 'fs.readFileSync',
          jsonFilePath,
        });
        return `{ "name": "example", "version": "0.0.1" }`;
      }
    }
  };

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
  };

  return lib(options, ioInjected)
    .then(() => { expect(mysnap).toMatchSnapshot(); });
});
