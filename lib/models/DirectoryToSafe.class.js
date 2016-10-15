/**
 * class DirectoryToSafe {
 *    _directory,
 *    _filesToSafe,
 *    _unsafeFilesMap,
 *    _recursive,
 *    _limit,
 *    updateDirectoryAndFilesToSafe(dirorfile = ''),
 *    isUnsafe(),
 *    report(),
 *    watchUnsafeRegexInFiles(),
 *    getUnsafeRegexInFilesSync(),
 *    getUnsafeRegexInFiles(callback)
 * }
 */
const FileToSafe = require('./FileToSafe.class');
const utils = require('../utils');
const defaults = require('../defaults');

const path = require('path');
const fs = require('fs');

const colors = require('colors/safe');

class DirectoryToSafe {
  // constructor
  constructor(dirorfile, recursive = defaults.recursive, limit = defaults.limit) {
    // TODO support *.ext path here and find all files with path.extname(file) === ext

    this.recursive = recursive;
    this.limit = limit;
    this.directory = null;
    this.filesToSafe = [];
    this.unsafeFilesMap = new Map();

    this.updateDirectoryAndFilesToSafe(dirorfile);
  }

  /* getters and setters */

  // set recursive
  set recursive(recursive) {
    if (recursive !== defaults.recursive) recursive = utils.toBoolean(recursive);
    this._recursive = recursive;
  }
  // get recursive
  get recursive() {
    return this._recursive;
  }

  // set limit
  set limit(limit) {
    if (limit !== defaults.limit) limit = utils.getInt(limit, 1);
    this._limit = limit;
  }
  // get limit
  get limit() {
    return this._limit;
  }

  // set directory
  // WARNING : no control on path, must be done by updateDirectoryAndFilesToSafe function
  set directory(path) {
    this._directory = path;
  }
  // get directory
  get directory() {
    return this._directory;
  }

  // set filesToSafe
  set filesToSafe(array) {
    if (utils.is(array, Array)) this._filesToSafe = array;
  }
  // get filesToSafe
  get filesToSafe() {
    return this._filesToSafe;
  }

  // set unsafeFilesMap
  set unsafeFilesMap(map) {
    if (utils.is(map, Map)) this._unsafeFilesMap = map;
  }
  // get unsafeFilesMap
  get unsafeFilesMap() {
    return this._unsafeFilesMap;
  }

  // "setter" update directory and filesToSafe because depending on a path that can be a directory or a file
  // set directory() and set filesToSafe() are only internal
  // if wanted to change path live, call updateDirectoryAndFilesToSafe(newPathForDirectoryOrFile)
  updateDirectoryAndFilesToSafe(dirorfile = '') {
    dirorfile = path.normalize(dirorfile);

    // directory
    if (utils.isDirectorySync(dirorfile)) {
      this.directory = dirorfile;
      this.filesToSafe = utils.getFilesSync(this.directory, this.recursive);
    } // file
    else if (utils.isFileSync(dirorfile)){
      this.directory = path.dirname(dirorfile);
      this.filesToSafe.push(dirorfile);
    } // bad path
    else {
      console.error(`${colors.red('safe-regex-cli error (DirectoryToSafe constructor):')} you must specify a valid path to a file or a directory of files : "${dirorfile}" does not exist. Run safe-regex -help for more details.`);
    }
  }


  /* functions */

  // function isUnsafe
  isUnsafe() {
    return this.unsafeFilesMap.size > 0;
  }

  // function report
  report() {
    if (this.directory) {
      if (!this.filesToSafe.length) console.error(`${colors.red('safe-regex-cli: no files in directory "' + this.directory + '".')}`);
      else if (!this.isUnsafe()) console.log(`${colors.green('safe-regex-cli: no potential regex risk detected in directory "' + this.directory + '" for file' + (this.filesToSafe.length > 1 ? 's': '') + ' "' + this.filesToSafe.join(', ') + '".')}`);
      else {
        console.log(`${colors.red('safe-regex-cli: potential regex risk detected in directory "' + this.directory + '" :')}`);
        for (let fileToSafe of this.unsafeFilesMap.values()) {
          fileToSafe.report();
        }
        console.log('');
      }
    } else {
      console.error(`${colors.red('safe-regex-cli error (DirectoryToSafe report):')} no report to make because of invalid path to a file or a directory of files when initializing object "DirectoryToSafe". Run safe-regex -help for more details.`);
    }
  }

  // function watchUnsafeRegexInFiles
  // TODO can add some callback for async and emit events to listen to...
  watchUnsafeRegexInFiles() {
    console.log(`${colors.grey('Watching for unsafe regex in "' + this.directory + '" directory...')}`);
    fs.watch(this.directory, {encoding: 'utf8', recursive: this.recursive}, (eventType, filename) => {
      const file = path.join(this.directory, filename);

      if (~this.filesToSafe.indexOf(file) && eventType === 'change') {
        console.log(`${colors.grey('file "' + filename + '" has changed...')}`);

        const fileToSafe = new FileToSafe(file, this.limit);
        fileToSafe.getUnsafeRegexInFileSync();

        // if file already an unsafe file, rewrite value with new regex found
        if (fileToSafe.isUnsafe()) this.unsafeFilesMap.set(file, fileToSafe);
        else this.unsafeFilesMap.delete(file); // if file key doesn't exist return false

        this.report();
      }
    });
  }

  // function getUnsafeRegexInFilesSync : for each file path in filesToSafe, if file is unsafe add it to the map with its path for key
  getUnsafeRegexInFilesSync() {
    for (let file of this.filesToSafe) {
      const fileToSafe = new FileToSafe(file, this.limit);
      fileToSafe.getUnsafeRegexInFileSync();
      if (fileToSafe.isUnsafe()) this.unsafeFilesMap.set(file, fileToSafe);
    }
  }

  // function getUnsafeRegexInFiles
  getUnsafeRegexInFiles(callback) {
    const len = this.filesToSafe.length;
    for (let i = 0; i < len; i++) {
      ((i) => {
        const fileToSafe = new FileToSafe(this.filesToSafe[i], this.limit);
        fileToSafe.getUnsafeRegexInFile(() => {
          if (fileToSafe.isUnsafe()) this.unsafeFilesMap.set(this.filesToSafe[i], fileToSafe);
          if (i === len - 1) callback();
        });
      })(i);
    }
  }
}

module.exports = DirectoryToSafe;
