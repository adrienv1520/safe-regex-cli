const path = require('path');

const regexdir = path.join(__dirname, 'regexdir');
const unsafefile = path.join(__dirname, 'regexdir', 'unsafe.js');
const safefile = path.join(__dirname, 'regexdir', 'safe.js');
const emptydir = path.join(__dirname, 'regexdir', 'emptydir');
const phantompath = 'xgkskfdhflhg0965(rèlgjldfsdjdslfjslfl';
const unsaferegex = /(safe-regex-cli+){10}/;

module.exports = {
  regexdir,
  unsafefile,
  safefile,
  emptydir,
  phantompath,
  unsaferegex,
  unsafemap
};
