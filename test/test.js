const expect = require('chai').expect;

const path = require('path');

const safeReport = require('../lib');
const safeReportSync = require('../lib').safeReportSync;

const DirectoryToSafe = require('../lib/models/DirectoryToSafe.class');
const FileToSafe = require('../lib/models/FileToSafe.class');
const UnsafeRegex = require('../lib/models/UnsafeRegex.class');
const FileLiner = require('../lib/models/FileLiner.class');
const utils = require('../lib/utils');

const regexdir = path.join(__dirname, 'regexdir');
const regexfile1 = path.join(__dirname, 'regexdir', 'regexfile1.js');
const emptydir = path.join(__dirname, 'regexdir', 'emptydir');
const phantompath = 'xgkskfdhflhg0965(rèlgjldfsdjdslfjslfl';

/* integration test */
// test safeReportSync
// test safeReport

/* unit tests to make in a new file */
// test DirectoryToSafe
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
