/**
 * FileToSafe class {file, unsafeRegexArray, limit}
 * @param {String} file the path to the file in which detecting unsafe regex
 */
const path = require('path');
const fs = require('fs');

const safe = require('safe-regex');

const colors = require('colors/safe');

const UnsafeRegex = require('./UnsafeRegex.class');
const FileLiner = require('./FileLiner.class');
const utils = require('../utils');

class FileToSafe {
  // constructor
  constructor(file) {
    this.file = path.normalize(file);
    if (!utils.isFileSync(this.file)) this.file = null;
    this.unsafeRegexArray = [];
  }

  // default limit constant
  static get LIMIT() {
    return 25;
  }

  // function isUnsafe
  isUnsafe() {
    return this.unsafeRegexArray.length > 0;
  }

  // function addUnsafeRegex
  addUnsafeRegex(unsafeRegex) {
    if (utils.is(unsafeRegex, UnsafeRegex)) this.unsafeRegexArray.push(unsafeRegex);
  }

  // function report
  report() {
    if (!this.isUnsafe()) {
      console.log(`${colors.green('safe-regex-cli: no potential regex risk detected in file "' + this.file + '".')}`);
    } else {
      console.log(`${colors.red('\nrisk in file "' + this.file + '" :')}`);
      for (let i = 0, len = this.unsafeRegexArray.length ; i < len; i++) {
        console.log(`\t- at line ${this.unsafeRegexArray[i].position}: ${this.unsafeRegexArray[i].regex}`);
      }
      console.log('');
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

    let lines = data.split(/[\n\r]/);

    lines.forEach((line, position) => {
      this.getUnsafeRegexInData(line, position + 1);
    });
  }

  // function getUnsafeRegexInFile
  getUnsafeRegexInFile(callback) {
    let fliner = new FileLiner(this.file);
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
    let r1 = /[^//](\/.+\/[gimy]{0,4})[.; ]/g;
    let r2 = /new RegExp\s*\(\s*(['"].+['"])\s*\)/g;

    // start first regex finding regex
    while ((regex = r1.exec(data)) !== null) {
      if (regex[1] && !safe(regex[1], {limit: this.limit})) {
        this.addUnsafeRegex(new UnsafeRegex(regex[1], position));
      }
    }

    // second regex
    // r2 get 'regexp', 'flag' from new RegExp('regexp', 'g') or 'regexp' from new RegExp('regexp')
    while ((regex = r2.exec(data)) !== null) {
      let withNoParams = /['"](.+)['"]/g;
      let withParams = /['"](.+)['"]\s*[,]\s*['"]([gmiy]{0,4})['"]/g;

      if (regex[1]) {
        let regexWithParams = withParams.exec(regex[1]);
        if (regexWithParams && regexWithParams[1] && regexWithParams[2]) {
          try {
            regex = new RegExp(regexWithParams[1], regexWithParams[2]);
          } catch(e) {} // SyntaxError, bad regex, nothing to do
        } else {
          let regexWithNoParams = withNoParams.exec(regex[1]);
          if (regexWithNoParams && regexWithNoParams[1]) {
            try {
              regex = new RegExp(regexWithNoParams[1]);
            } catch(e) {} // SyntaxError, bad regex, nothing to do
          }
        }
        if (!safe(regex, {limit: this.limit})) this.addUnsafeRegex(new UnsafeRegex(regex, position));
      }
    }
  }
}

module.exports = FileToSafe;
