const assert = require('assert');
const path = require('path');

const safeReport = require('../lib');
const safeReportSync = require('../lib').safeReportSync;

const DirectoryToSafe = require('../lib/models/DirectoryToSafe.class');
const FileToSafe = require('../lib/models/FileToSafe.class');
const UnsafeRegex = require('../lib/models/UnsafeRegex.class');
const FileLiner = require('../lib/models/FileLiner.class');
const utils = require('../utils');

const regexdir = path.join(__dirname, 'regex-dir');

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
