const lib = require('../../../../../lib/lib.js');

const ioInject = require('../../../helpers/io-inject.js');

test("create alice-bobbi module with `modulePrefix: 'custom-prefix'` for Android & iOS", async () => {
  const mysnap = [];

  const inject = ioInject(mysnap);

  const options = {
    name: 'alice-bobbi',
    modulePrefix: 'custom-prefix'
  };

  await lib(options, inject);
  expect(mysnap).toMatchSnapshot();
});
