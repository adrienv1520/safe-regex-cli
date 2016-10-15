/**
 * class FileToSafe {
 *    _file,
 *    _unsafeRegexArray,
 *    _limit,
 *    isUnsafe(),
 *    report(),
 *    getUnsafeRegexInFileSync(),
 *    getUnsafeRegexInFile(callback),
 *    getUnsafeRegexInData(data, position = -1)
 * }
 */
const UnsafeRegex = require('./UnsafeRegex.class');
const FileLiner = require('./FileLiner.class');
const utils = require('../utils');
const defaults = require('../defaults');

const path = require('path');
const fs = require('fs');

const safe = require('safe-regex');

const colors = require('colors/safe');

class FileToSafe {
  // constructor
  constructor(file, limit = defaults.limit) {
    this.file = file;
    this.limit = limit;
    this.unsafeRegexArray = [];
  }

  /* getters and setters */

  // set file
  set file(file) {
    file = path.normalize(file);
    if (!utils.isFileSync(file)) file = null;
    this._file = file;
  }
  // get file
  get file() {
    return this._file;
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

  // set unsafeRegexArray
  set unsafeRegexArray(array) {
    if (utils.is(array, Array)) this._unsafeRegexArray = array;
  }
  // get unsafeRegexArray
  get unsafeRegexArray() {
    return this._unsafeRegexArray;
  }

  /* functions */

  // function isUnsafe
  isUnsafe() {
    return this.unsafeRegexArray.length > 0;
  }

  // function report
  report() {
    if (this.file) {
      if (!this.isUnsafe()) {
        console.log(`${colors.green('safe-regex-cli: no potential regex risk detected in file "' + this.file + '".')}`);
      } else {
        console.log(`${colors.red('\nrisk in file "' + this.file + '" :')}`);
        for (let unsafeRegex of this.unsafeRegexArray) {
          console.log(`\t- at line ${unsafeRegex.position}: ${unsafeRegex.regex}`);
        }
        console.log('');
      }
    } else {
      console.error(`${colors.red('safe-regex-cli error (FileToSafe report):')} no report to make because of invalid path to a file when initializing object "FileToSafe". Run safe-regex -help for more details.`);
    }
  }

  // function getUnsafeRegexInFileSync
  getUnsafeRegexInFileSync() {
    let data = '';
    if (this.file) {
      try {
        data = fs.readFileSync(this.file, 'utf8');
      } catch(e) {
        return console.error(`${colors.red('safe-regex-cli error: trying to access function getUnsafeRegex')}\n${e}`);
      }
    }

    const lines = data.split(/[\n\r]/);

    lines.forEach((line, position) => {
      this.getUnsafeRegexInData(line, position + 1);
    });
  }

  // function getUnsafeRegexInFile
  getUnsafeRegexInFile(callback) {
    const fliner = new FileLiner(this.file);
    fliner.on('line', (line, position) => {
      this.getUnsafeRegexInData(line, position);
    });
    fliner.on('close', () => {
      callback();
    });
  }

  // function getUnsafeRegexInData
  getUnsafeRegexInData(data, position = -1) {
    let regex = null;
    const r1 = /[^//](\/.+\/[gimy]{0,4})[.; ]/g;
    const r2 = /new RegExp\s*\(\s*(['"].+['"])\s*\)/g;

    // start first regex finding regex
    while ((regex = r1.exec(data)) !== null) {
      const [, capturedRegex] = regex;
      if (capturedRegex && !safe(capturedRegex, {limit: this.limit})) {
        this.unsafeRegexArray.push(new UnsafeRegex(capturedRegex, position));
      }
    }

    // second regex
    // r2 get 'regexp', 'flag' from new RegExp('regexp', 'g') or 'regexp' from new RegExp('regexp')
    while ((regex = r2.exec(data)) !== null) {
      const withNoArgs = /['"](.+)['"]/g;
      const withArgs = /['"](.+)['"]\s*[,]\s*['"]([gmiy]{0,4})['"]/g;
      const [, capturedRegex] = regex;
      if (capturedRegex) {
        const [, regexArg, flagArg] = withArgs.exec(capturedRegex) || [];
        if (regexArg && flagArg) {
          try {
            regex = new RegExp(regexArg, flagArg);
          } catch(e) {} // SyntaxError, bad regex, nothing to do
        } else {
          const [, regexArg] = withNoArgs.exec(capturedRegex) || [];
          if (regexArg) {
            try {
              regex = new RegExp(regexArg);
            } catch(e) {} // SyntaxError, bad regex, nothing to do
          }
        }
        if (!safe(regex, {limit: this.limit})) this.unsafeRegexArray.push(new UnsafeRegex(regex, position));
      }
    }
  }
}

module.exports = FileToSafe;
