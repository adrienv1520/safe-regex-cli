const path = require('path');

const regexdir = path.join(__dirname, 'regexdir');
const unsafefile = path.join(__dirname, 'regexdir', 'unsafe.js');
const safefile = path.join(__dirname, 'regexdir', 'safe.js');
const emptydir = path.join(__dirname, 'regexdir', 'emptydir');
const phantompath = 'xgkskfdhflhg0965(rèlgjldfsdjdslfjslfl';
const unsaferegex = /(safe-regex-cli+){10}/;

// key = the regex | value = string data where the regex can be found
let unsafemap = new Map();
unsafemap.set('/(safe+){10}/', ' /(safe+){10}/ ');
unsafemap.set('/(regex-cli+/]){10}/i', '//(regex-cli+){10}/i');
unsafemap.set('/(cli+){10}/g', '  /(cli+){10}/g  ');
unsafemap.set('/(safe-regex-cli+){10}/g', ' const myRegex = new RegExp("(safe-regex-cli+){10}", "g");');
unsafemap.set('/(safe-regex-cli+){10}/gi', ' const myRegex = new RegExp ( "(safe-regex-cli+){10}","gi") ;');

module.exports = {
  regexdir,
  unsafefile,
  safefile,
  emptydir,
  phantompath,
  unsaferegex,
  unsafemap
};
