/**
 * safe-regex-cli © 2016 Adrien Valcke
 * The command line tool for safe-regex module to detect potentially catastrophic exponential-time regular expressions by limiting the star height to 1..
 * Main entry for lib. Synchronous and asynchronous functions.
 *
 * TODO
 * - add support to *.js path in DirectoryToSafe(dirorfile) function
 * - test
 */
const safe = require('safe-regex');

const DirectoryToSafe = require('./models/DirectoryToSafe');
const FileToSafe = require('./models/FileToSafe');
const utils = require('./utils');

/** MAIN ENTRY POINT : can be require in a module. const safeReport = require('safe-regex-cli');
 * safeReport Asynchronous function to get a report on unsafe regex files
 * @param  {String}  dirorfile     path to a directory or a file
 * @param  {Number}  [limit=25]    number of allowed repetitions in the entire regular expressions found (default 25)
 * @param  {Boolean} [watch=false] watch or not files when changing
 */
var safeReport = function (dirorfile, limit = FileToSafe.prototype.limit, watch = false) {
  limit = utils.getInt(limit, 1); // get limit if Number or 1 at least (min)
  FileToSafe.prototype.limit = limit;

  watch = utils.toBoolean(watch);

  let unsafe = new DirectoryToSafe(dirorfile);
  unsafe.getUnsafeRegexInFiles(() => {
    unsafe.report();
    if (watch) unsafe.watchUnsafeRegexInFiles();
  });
};

/** ENTRY POINT for cli
 * safeReport Synchronous function to get a report on unsafe regex files
 * @param  {String}  dirorfile     path to a directory or a file
 * @param  {Number}  [limit=25]    number of allowed repetitions in the entire regular expressions found (default 25)
 * @param  {Boolean} [watch=false] watch or not files when changing
 */
var safeReportSync = function (dirorfile, limit = FileToSafe.prototype.limit, watch = false) {
  limit = utils.getInt(limit, 1); // get limit if Number or 1 at least (min)
  FileToSafe.prototype.limit = limit;

  watch = utils.toBoolean(watch);

  let unsafe = new DirectoryToSafe(dirorfile);

  unsafe.getUnsafeRegexInFilesSync();
  unsafe.report();

  if (watch) unsafe.watchUnsafeRegexInFiles();
};

module.exports = safeReport;
module.exports.safeReportSync = safeReportSync;
module.exports.safe = safe;
