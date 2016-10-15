const path = require('path');
const fs = require('fs');
const readline = require('readline');
const EventEmitter = require('events');

const colors = require('colors/safe');

const encodings = ['utf8', 'base64', 'hex', 'binary', 'latin1', 'ucs2', 'utf16le', 'ascii'];

class FileLiner extends EventEmitter {
  // constructor
  constructor(file, encoding = encodings[0]) {
    super();

    this.nbLines = 0;
    this.closed = false;

    if (!~encodings.indexOf(encoding.toLowerCase())) encoding = encodings[0];
    this.encoding = encoding;

    this.file = path.normalize(file);
    this.rstream = fs.createReadStream(this.file, this.encoding);
    this.rl = null;

    this.handleRstreamEvents();
  }

  // handle createReadStream events
  handleRstreamEvents() {
    this.rstream.on('error', (err) => {
      return console.log(`${colors.red('safe-regex-cli error (FileLiner):')} an error occured with file "${this.file}":\n${err}`);
    });

    this.rstream.on('readable', () => {
      this.rl = readline.createInterface({
        input: this.rstream
      });
      this.handleRlEvents();
    });

    this.rstream.on('close', () => {
      if (!this.closed){
        this.closed = true;
        this.emit('close');
      }
    });
  }

  // handle readline events
  handleRlEvents() {
    this.rl.on('line', (line) => {
      this.nbLines++;
      this.emit('line', line, this.nbLines);
    });

    this.rl.on('close', () => {
      if (!this.closed){
        this.closed = true;
        this.emit('close');
      }
    });
  }
}

module.exports = FileLiner;
