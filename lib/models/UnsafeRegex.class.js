/**
 * class UnsafeRegex class {
 *    _regex,
 *    _position
 * }
 */
class UnsafeRegex {
  constructor(regex, position) {
    this.regex = regex;
    this.position = position;
  }

  // set position
  set position(position) {
    position = parseInt(position);
    if (!Number.isNaN(position) && position >= 0) this._position = position;
    else this._position = -1;
  }

  // get position
  get position() {
    return this._position;
  }

  // set regex
  set regex(regex) {
    this._regex = regex;
  }

  // get regex
  get regex() {
    return this._regex;
  }
}

module.exports = UnsafeRegex;
