module.exports = (mysnap) => ({
  fs: {
    outputFile: (name, content) => {
      mysnap.push(
        `* outputFile name: ${name}
content:
--------
${content}
<<<<<<<< ======== >>>>>>>>
`);

      return Promise.resolve();
    },

    ensureDir: (dir) => {
      mysnap.push(`* ensureDir dir: ${dir}\n`);
      return Promise.resolve();
    },
    readFile: (jsonFilePath, _, cb) => {
      mysnap.push({
        call: 'fs.readFile',
        jsonFilePath,
      });
      return cb(null, `{
  "name": "example",
  "scripts": {
    "test": "echo 'not implemented' && exit 1"
  }
}`);
    },
    writeFileSync: (path, json, options) => {
      mysnap.push({
        call: 'fs.writeFileSync',
        filePath: path,
        json,
        options,
      });
    },
  },
  execa: {
    command: (command, options) => {
      mysnap.push(
        `* execa.command command: ${command} options: ${JSON.stringify(options)}\n`);
      return Promise.resolve();
    },
  },
});
