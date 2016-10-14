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
    if (thing === 'false' || thing <= 0)
      return false;
    if (thing === 'true' || thing >= 1)
      return true;
    if (thing === true || thing === false)
      return thing;
    return false;
  },
  // is
  is(thing, Type) {
    if (!typeof Type || Type === null || Type === undefined || Number.isNaN(Type) || !Type.prototype) return false;
    return Type.prototype.isPrototypeOf(Object(thing));
    // return Object.prototype.isPrototypeOf.call(Type.prototype, Object(thing));
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
      var stat = fs.statSync(path.normalize(directory));
      if (stat.isDirectory()) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  // isFileSync
  isFileSync(file){
    try {
      var stat = fs.statSync(path.normalize(file));
      if (stat.isFile()) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  // getFilesSync
  getFilesSync(pathToContent, recursive = false) {
    let files = [];
    recursive = this.toBoolean(recursive);

    pathToContent = path.normalize(pathToContent);

    if (this.isFileSync(pathToContent)) {
      files.push(pathToContent);
    } else if (this.isDirectorySync(pathToContent)) {
      let contents = fs.readdirSync(pathToContent, 'utf8');
      for(content of contents) {
        let contentPath = path.join(pathToContent, content);
        if (this.isFileSync(contentPath)) files.push(contentPath);
        else if (recursive && this.isDirectorySync(contentPath)) files = files.concat(this.getFilesSync(contentPath, recursive));
      }
    } else {
      console.error(`${colors.red('safe-regex-cli error: no such file or directory "' + pathToContent + '".')}`);
    }
    return files;
  },
  // getFiles Async
  getFiles(pathToContent, callback) {
    let filesArray = [];
    pathToContent = path.normalize(pathToContent);

    fs.stat(pathToContent, (err, stats) => {
      if (err) return callback(err);
      if (stats.isFile()) {
        filesArray.push(pathToContent);
        callback(null, filesArray);
      } else if (stats.isDirectory()) {
        fs.readdir(pathToContent, 'utf8', (err, files) => {
          for(let i = 0, len = files.length; i < len; i++) {
            ((i) => {
              let filePath = path.join(pathToContent, files[i]);
              fs.stat(filePath, (err, stats) => {
                if (err) return callback(err);
                if (stats.isFile()) filesArray.push(filePath);
                if (i === len - 1) callback(null, filesArray);
              });
            })(i);
          }
        });
      } else {
        callback(new Error(`${colors.red('safe-regex-cli error: no such file or directory "' + pathToContent + '".')}`));
      }
    });
  },
  // getInt
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
  }
};
