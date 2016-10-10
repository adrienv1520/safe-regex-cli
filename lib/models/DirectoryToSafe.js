/**
 * DirectoryToSafe object {directory, filesToSafe, unsafeFilesArray}
 * @param {String} dirorfile    path to a directory or a file to detect unsafe regex
 */
const path = require('path');
const fs = require('fs');

const colors = require('colors/safe');

const FileToSafe = require('./FileToSafe');
const utils = require('../utils');

function DirectoryToSafe(dirorfile) {
  // TODO support *.ext path here and find all files with path.extname() === ext

  dirorfile = path.normalize(dirorfile);
  this.unsafeFilesArray = [];
  this.filesToSafe = [];
  this.directory = null;

  // directory
  if (utils.isDirectorySync(dirorfile)) {
    this.directory = dirorfile;
    let files = fs.readdirSync(this.directory, 'utf8');
    if (files.length) {
      this.filesToSafe = files.map((basename) => {
        return path.join(this.directory, basename);
      });
    } else {
      console.error(`${colors.red('\nsafe-regex-cli: no files in directory "' + this.directory + '".')}`);
    }
  } // file
  else if (utils.isFileSync(dirorfile)){
    this.directory = path.dirname(dirorfile);
    this.filesToSafe.push(dirorfile);
  } // bad path
  else {
    console.error(`${colors.red('safe-regex-cli error:')} you must specify a valid path to a file or a directory of files : "${dirorfile}" does not exist. Run safe-regex -help for more details.`);
  }
}
DirectoryToSafe.prototype.addUnsafeFile = function(fileToSafe) {
  if (utils.is(fileToSafe, FileToSafe)) this.unsafeFilesArray.push(fileToSafe);
};
DirectoryToSafe.prototype.isUnsafe = function() {
  return this.unsafeFilesArray.length > 0;
};
DirectoryToSafe.prototype.report = function() {
  if (!this.isUnsafe()) {
    if (this.directory) console.log(`${colors.green('safe-regex-cli: no potential regex risk detected in directory "' + this.directory + '" for file' + (this.filesToSafe.length > 1 ? '(s) ': ' ') + '"' + this.filesToSafe.join(', ') + '".')}`);
  } else {
    console.log(`${colors.red('\nsafe-regex-cli: potential regex risk detected in directory "' + this.directory + '" :')}`);
    for (let i = 0, len = this.unsafeFilesArray.length ; i < len; i++) {
      this.unsafeFilesArray[i].report();
    }
    console.log('');
  }
};
DirectoryToSafe.prototype.watchUnsafeRegexInFiles = function(callback) {
  console.log(`${colors.grey('Watching for unsafe regex in "' + this.directory + '" directory...')}`);
  fs.watch(this.directory, (eventType, filename) => {
    let file = path.join(this.directory, filename);
    if (~this.filesToSafe.indexOf(file)) {
      if (eventType === 'change') {
        console.log(`${colors.grey('file "' + filename + '" has changed...')}`);
        let fileToSafe = new FileToSafe(file);
        fileToSafe.getUnsafeRegexInFileSync();
        if (fileToSafe.isUnsafe()) {
          let index = this.findInUnsafeFilesArray(file);
          if (!~index) this.addUnsafeFile(fileToSafe);
        }
        else {
          let index = this.findInUnsafeFilesArray(file);

          if (~index) {
            if (index === 0) this.unsafeFilesArray.shift();
            else if (index === this.unsafeFilesArray.length) this.unsafeFilesArray.pop();
            else this.unsafeFilesArray.splice(index, 1);
          }

          // with filters
          // this.unsafeFilesArray = this.unsafeFilesArray.filter((fileToSafe) => {
          //   if (fileToSafe.file !== file) return fileToSafe;
          // });
          this.report();
        }
        if (this.isUnsafe()) this.report();
      }
    }
  });
};
DirectoryToSafe.prototype.findInUnsafeFilesArray = function(file) {
  let found = false,
      i = 0,
      len = this.unsafeFilesArray.length;

  while (i < len && !found) {
    if (this.unsafeFilesArray[i].file === file) {
      found = true;
    }
    else i++;
  }
  if (found) return i;
  else return -1;
};
DirectoryToSafe.prototype.getUnsafeRegexInFiles = function(callback) {
  let i = 0,
      len = this.filesToSafe.length;

  while (i < len) {
    ((i) => {
      let fileToSafe = new FileToSafe(this.filesToSafe[i]);
      fileToSafe.getUnsafeRegexInFile(() => {
        if (fileToSafe.isUnsafe()) this.addUnsafeFile(fileToSafe);
        if (i === this.filesToSafe.length - 1) callback();
      });
    })(i);
    i++;
  }
};
DirectoryToSafe.prototype.getUnsafeRegexInFilesSync = function() {
  for (let i = 0, len = this.filesToSafe.length; i < len; i++) {
    let fileToSafe = new FileToSafe(this.filesToSafe[i]);
    fileToSafe.getUnsafeRegexInFileSync();
    if (fileToSafe.isUnsafe()) this.addUnsafeFile(fileToSafe);
  }
};

module.exports = DirectoryToSafe;
