const lib = require('../../lib/lib.js');

const ioMocks = require('../helpers/io-mocks.js');

test('create module with example, with `yarn add` failure', async () => {
  // with snapshot info ignored in this test
  const ioInject = ioMocks([]);
  const ioInjected = {
    ...ioInject,
    execa: {
      command: (command, _) => {
        if (/yarn add/.test(command)) {
          return Promise.reject(new Error('ENOPERM not permitted'));
        }
        return Promise.resolve();
      }
    }
  };

  const options = {
    name: 'alice-bettty',
    generateExample: true
  };

  let error;
  try {
    // expected to throw:
    await lib(options, ioInjected);
  } catch (e) {
    error = e;
  }
  expect(error).toBeDefined();
  expect(error.message).toMatch(/ENOPERM not permitted/);
});
