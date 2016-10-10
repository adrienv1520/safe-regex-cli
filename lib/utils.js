const fs = require('fs');
const path = require('path');

module.exports = {
  // SIZE
  size: function(thing) {
    if (thing !== undefined && thing !== null && thing !== NaN) return Object.keys(thing).length;
    else return 0;
  },
  // TOBOOLEAN
  toBoolean: function(thing) {
    if (thing === 'false' || thing <= 0)
      return false;
    if (thing === 'true' || thing >= 1)
      return true;
    if (thing === true || thing === false)
      return thing;
    return false;
  },
  is: function(thing, Type) {
    if (!typeof Type || Type === null || Type === undefined || Number.isNaN(Type) || !Type.prototype) return false;
    return Type.prototype.isPrototypeOf(Object(thing));
  },
  existsSync: function(file){
    try {
      fs.statSync(path.normalize(file));
      return true;
    } catch (e) {
      return false;
    }
  },
  isDirectorySync: function(file){
    try {
      var stat = fs.statSync(path.normalize(file));
      if (stat.isDirectory()) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  isFileSync: function(file){
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
  getInt: function(thing, min = 0){
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
