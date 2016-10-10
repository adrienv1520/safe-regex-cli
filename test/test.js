const assert = require('assert');

const DirectoryToSafe = require('../lib/models/DirectoryToSafe');
const FileToSafe = require('../lib/models/FileToSafe');
const UnsafeRegex = require('../lib/models/UnsafeRegex');
const FileLiner = require('../lib/models/FileLiner.class');
const utils = require('../utils');

// test DirectoryToSafe
describe('DirectoryToSafe', function(){
  describe('constructor', function() {
    it('should have an existing directory', function(){
      var directoryToSafe = new DirectoryToSafe('path');
      assert.equal('path', directoryToSafe.directory);
    });
  });
});

// test FileToSafe

// test UnsafeRegex

// test FileLiner
// let fliner = new FileLiner('./test/regex.js');
//
// fliner.on('line', (line, position) => {
//   console.log(`at line ${position} = ${line}`);
// });
//
// fliner.on('close', () => {
//   console.log('Closed!\nTotal number of lines = ' + fliner.nbLines);
// });

// test utils
