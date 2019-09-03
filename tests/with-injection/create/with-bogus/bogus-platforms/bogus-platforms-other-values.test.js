const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

describe('create module library package with other bogus values of platforms (should throw)', () => {
  [false, true, null, 0, 1, {}, undefined, (0 / 0), Infinity].forEach(value =>
    test(`with bogus platforms: ${value} setting should throw`, async () => {
      const mysnap = [];

      const inject = ioInject(mysnap);

      const options = {
        name: 'alice-bobbi',
        platforms: value
      };

      try {
        await lib(options, inject);
      } catch (e) {
        expect(e).toBeDefined();
      }
    })
  );
});
