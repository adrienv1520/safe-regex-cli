/**
 * utils functions © 2016 Adrien Valcke
 *
 * size(thing)
 * toBoolean(thing)
 * is(thing, Type)
 * has(property, thing)
 * existsSync(pathToContent)
 * isDirectorySync(directory)
 * isFileSync(file)
 * getFilesSync(pathToContent, recursive = false)
 * getFiles(pathToContent, callback)
 * getInt(thing, min = 0)
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  // size
  size(thing) {
    if (thing !== undefined && thing !== null && thing !== NaN) return Object.keys(thing).length;
    else return 0;
  },
  // toBoolean
  toBoolean(thing) {
    if (thing === 'false' || thing <= 0) return false;
    if (thing === 'true' || thing >= 1) return true;
    if (thing === true || thing === false) return thing;
    return false;
  },
  // getInt : returns thing if is int or 0 or the min value if specified
  // examples :
  // getInt('hello') // returns 0
  // getInt('99') // returns 99
  // considering a user input userInput = 20
  // getInt(userInput, 25) // returns 25
  // considering a user input userInput = 'i put bad things there hahaha'
  // getInt(userInput, 1) // returns 1
  getInt(thing, min = 0){
    thing = parseInt(thing);
    min = parseInt(min);

    if (Number.isNaN(thing)) {
      if (!Number.isNaN(min)) return min;
      else return 0;
    } else {
      if (!Number.isNaN(min)) {
        if (thing > min) return thing;
        else return min;
      } else return thing;
    }
  },
  // is
  is(thing, Type) {
    if (!typeof Type || Type === null || Type === undefined || Number.isNaN(Type) || !Type.prototype) return false;
    return Object.prototype.isPrototypeOf.call(Type.prototype, Object(thing));
  },
  // has
  has(property, thing) {
    if (thing === null || thing === undefined || Number.isNaN(thing)) return false;
    return Object.prototype.hasOwnProperty.call(thing, property);
  },
  // existsSync
  existsSync(pathToContent){
    try {
      fs.statSync(path.normalize(pathToContent));
      return true;
    } catch (e) {
      return false;
    }
  },
  // isDirectorySync
  isDirectorySync(directory){
    try {
      const stats = fs.statSync(path.normalize(directory));
      if (stats.isDirectory()) return true;
      else return false;
    } catch (e) {
      return false;
    }
  },
  // isFileSync
  isFileSync(file){
    try {
      const stats = fs.statSync(path.normalize(file));
      if (stats.isFile()) return true;
      else return false;
    } catch (e) {
      return false;
    }
  },
  // getFilesSync : returns an array of files path, if pathToContent is a file, returns an array with one entry
  getFilesSync(pathToContent, recursive = false) {
    let files = [];
    if (recursive !== false) recursive = this.toBoolean(recursive);

    if (!this.is(pathToContent, String)) return files;
    pathToContent = path.normalize(pathToContent);

    if (this.isFileSync(pathToContent)) {
      files.push(pathToContent);
    } else if (this.isDirectorySync(pathToContent)) {
      const contents = fs.readdirSync(pathToContent, 'utf8');
      for(let content of contents) {
        const contentPath = path.join(pathToContent, content);
        if (this.isFileSync(contentPath)) files.push(contentPath);
        else if (recursive && this.isDirectorySync(contentPath)) files = [...files, ...this.getFilesSync(contentPath, recursive)];
      }
    } else {
      console.error(`${colors.red('safe-regex-cli error: no such file or directory "' + pathToContent + '".')}`);
    }
    return files;
  },
  // getFiles Async
  getFiles(pathToContent, callback) {
    let filesArray = [];
    if (!this.is(pathToContent, String)) return callback(new Error(`${colors.red('safe-regex-cli (utils.getFiles): path must be a string.')}`)); 
    pathToContent = path.normalize(pathToContent);

    fs.stat(pathToContent, (err, stats) => {
      if (err) return callback(err);
      if (stats.isFile()) {
        filesArray.push(pathToContent);
        callback(null, filesArray);
      } else if (stats.isDirectory()) {
        fs.readdir(pathToContent, 'utf8', (err, files) => {
          for (let i = 0, len = files.length; i < len; i++) {
            ((i) => {
              const filePath = path.join(pathToContent, files[i]);
              fs.stat(filePath, (err, stats) => {
                if (err) return callback(err);
                if (stats.isFile()) filesArray.push(filePath);
                if (i === len - 1) callback(null, filesArray);
              });
            })(i);
          }
        });
      } else {
        callback(new Error(`${colors.red('safe-regex-cli (utils.getFiles): no such file or directory "' + pathToContent + '".')}`));
      }
    });
  },
};
