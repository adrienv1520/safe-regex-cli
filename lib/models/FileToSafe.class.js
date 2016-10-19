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
    if(!utils.is(file, String)) file = '';
    else file = path.normalize(file);

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
    if (this.file) {
      let data = '';
      try {
        data = fs.readFileSync(this.file, 'utf8');
      } catch(e) {
        return console.error(`${colors.red('safe-regex-cli error: trying to access function getUnsafeRegex')}\n${e}`);
      }

      const lines = data.split(/[\n\r]/);

      lines.forEach((line, position) => {
        this.getUnsafeRegexInData(line, position + 1);
      });
    }
  }

  // function getUnsafeRegexInFile
  getUnsafeRegexInFile(callback) {
    const fliner = new FileLiner(this.file);
    fliner.on('line', (line, position) => {
      this.getUnsafeRegexInData(line, position);
    });
    fliner.on('error', err => callback(err));
    fliner.on('close', () => callback());
  }

  // function getSlashRegex
  getSlashRegex(data) {
    let regexArray = [],
        i = 0,
        iLeftSlash = -1,
        iRightSlash = -1,
        iLeftSquareBracket = -1,
        iRightSquareBracket = -1,
        flags = '';

    const dataLength = data.length;

    while(!~iRightSlash && i < dataLength) {

      if (!~iLeftSlash && data[i] === '/' && data[i+1] !== '/') iLeftSlash = i;
      if (~iLeftSlash && data[i] === '/' && (i - iLeftSlash) > 1) iRightSlash = i;
      if (data[i] === '[' && data[i-1] !== '\\') iLeftSquareBracket = i;
      if (data[i] === '\n' || data[i] === '\r') iLeftSquareBracket = -1;

      if (~iRightSlash) {
        if (data[iRightSlash-1] === '\\' && data[iRightSlash-2] !== '\\') iRightSlash = -1;
        if (~iLeftSquareBracket && iLeftSquareBracket < iRightSlash) {
          // find second bracket
          let j = iLeftSquareBracket + 1;
          while (!~iRightSquareBracket && j < dataLength) {
            if (data[j] === ']' && data[j-1] !== '\\') iRightSquareBracket = j;
            else j++;
          }
          if (~iRightSquareBracket && iRightSquareBracket > iRightSlash) iRightSlash = -1;
        }

        if (~iRightSlash) {
          let k = iRightSlash + 1;
          while (k < dataLength && (k - iRightSlash) <= 4 && (data[k] === 'g' || data[k] === 'i' || data[k] === 'm' || data[k] === 'y')) {
            if (!~flags.indexOf(data[k])) flags += data[k];
            k++;
          }
          regexArray.push(data.substring(iLeftSlash, iRightSlash + 1) + flags);
          if (iRightSlash < dataLength) regexArray = [...regexArray, ...this.getSlashRegex(data.slice(iRightSlash + 1))];
        }
      }

      i++;
    }
    return regexArray;
  }

  // function getUnsafeRegexInData
  getUnsafeRegexInData(data, position = -1) {
    // let regex = null;

    // start finding slash regex /.../
    const slashRegex = this.getSlashRegex(data);
    for (const regex of slashRegex) {
      if (!safe(regex, {limit: this.limit})) this.unsafeRegexArray.push(new UnsafeRegex(regex, position));
    }

    // get 'regexp', 'flag' from new RegExp('regexp', 'g') or 'regexp' from new RegExp('regexp')
    const newRegExp = /new RegExp\s*\(\s*(['"].+['"])\s*\)/g;
    let regex = null;
    while ((regex = newRegExp.exec(data)) !== null) {
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
