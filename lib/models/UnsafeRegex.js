/**
 * UnsafeRegex object {regex, position}
 * @param {Number} position   line position in file where regex was found
 * @param {String} regex      the regex that is unsafe
 */
function UnsafeRegex(regex, position) {
  this.regex = regex;

  position = parseInt(position);
  if (!Number.isNaN(position) && position >= 0) {
    this.position = position;
  } else {
    this.position = -1;
  }
}

module.exports = UnsafeRegex;
