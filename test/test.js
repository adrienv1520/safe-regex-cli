const expect = require('chai').expect;
const assert = require('assert');

const path = require('path');

const safeReport = require('../lib');
const safeReportSync = require('../lib').safeReportSync;

const DirectoryToSafe = require('../lib/models/DirectoryToSafe.class');
const FileToSafe = require('../lib/models/FileToSafe.class');
const UnsafeRegex = require('../lib/models/UnsafeRegex.class');
const FileLiner = require('../lib/models/FileLiner.class');
const utils = require('../lib/utils');

const regexdir = path.join(__dirname, 'regexdir');
const emptydir = path.join(__dirname, 'regexdir', 'emptydir');
const phantompath = 'xgkskfdhflhg0965(rèlgjldfsdjdslfjslfl';

// test safeReportSync

// test safeReport


// test DirectoryToSafe
describe('DirectoryToSafe', function(){
  describe('constructor', function() {
    const directoryToSafe = new DirectoryToSafe(regexdir);
    const directoryEmpty = new DirectoryToSafe(emptydir);
    const directoryPhantom = new DirectoryToSafe(phantompath);

    it('should have a directory path if path exists', function(){
      expect(directoryToSafe.directory).to.equal(regexdir);
    });
    it('should not have a directory path if path does not exists', function(){
      expect(directoryPhantom.directory).to.not.exist;
    });
    it('should have a recursive option that is a boolean', function(){
      expect(directoryToSafe.recursive).to.be.a('boolean');
    });
    it('should have a limit option that is a number', function(){
      expect(directoryToSafe.limit).to.be.a('number');
    });
    it('should have an array of files to safe that is not empty if files in directory', function(){
      expect(directoryToSafe.filesToSafe).to.be.a('array').and.to.have.length;
    });
    it('should have an array of files to safe that is empty if no files in directory', function(){
      expect(directoryEmpty.filesToSafe).to.be.a('array').and.to.be.empty;
    });
    it('should have a map of unsafe files that is empty', function(){
      expect(directoryToSafe.unsafeFilesMap).to.be.a('map').and.to.be.empty;
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
