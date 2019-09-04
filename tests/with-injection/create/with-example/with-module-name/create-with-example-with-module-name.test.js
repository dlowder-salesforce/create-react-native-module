const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test("create alice-bobbi module with example, with `moduleName: 'custom'`", async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    generateExample: true,
    moduleName: 'custom'
  };

  await lib(options, inject);

  expect(mysnap).toMatchSnapshot();
});
