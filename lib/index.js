/**
 * safe-regex-cli © 2016 Adrien Valcke
 * The command line tool for safe-regex module to detect potentially catastrophic exponential-time regular expressions by limiting the star height to 1..
 *
 * Main entry for lib. Synchronous and asynchronous functions.
 *
 */
const defaults = require('../lib/defaults');

const DirectoryToSafe = require('./models/DirectoryToSafe.class');
const FileToSafe = require('./models/FileToSafe.class');
const utils = require('./utils');

const safe = require('safe-regex');

/** MAIN ENTRY POINT : can be require in a module. const safeReport = require('safe-regex-cli');
 * safeReport Asynchronous function to get a report on unsafe regex files
 * @param  {String}     dirorfile     path to a directory or a file
 * @param  {Object}     options       recursive: false, limit: 25, watch: false
 * @param  {Function}   callback      callback
 */
const safeReport = function safeReport(dirorfile, options, callback) {
  let recursive = defaults.recursive,
      limit = defaults.limit,
      watch = defaults.watch,
      cb = callback;

  // if no options then options is the callback
  if (utils.is(options, Function)) {
    cb = options;
  } else {
    // check options like this because options can be a missing parameter and we need to filter options
    // otherwise we could do const {recursive = false, limit = FileToSafe.LIMIT, watch = false} in parameter replacing options
    if (options.recursive) recursive = utils.toBoolean(options.recursive);
    if (options.limit) {
      limit = utils.getInt(options.limit, 1); // get limit if Number or 1 at least (min)
      FileToSafe.prototype.limit = limit; // all future fileToSafe objects will be set with this limit or default constant LIMIT of class, so they will have this.limit access
    }
    if (options.watch) watch = utils.toBoolean(options.watch);
  }

  let directory = new DirectoryToSafe(dirorfile, recursive);
  directory.getUnsafeRegexInFiles(() => {
    if (watch) {
      directory.report();
      directory.watchUnsafeRegexInFiles();
    }
    else cb(directory);
  });
};

/** ENTRY POINT for cli
 * safeReport Synchronous function to get a report on unsafe regex files
 * @param  {String}  dirorfile     path to a directory or a file
 * @param  {Boolean} recursive     indicates whether all subdirectories should be tested or watched, or only the current directory (false by default)
 * @param  {Number}  [limit=25]    number of allowed repetitions in the entire regular expressions found (default 25)
 * @param  {Boolean} [watch=false] watch or not files when changing
 */
const safeReportSync = function safeReportSync({dirorfile = '', recursive = defaults.recursive, limit = defaults.limit, watch = defaults.watch}) {

  // filter options limit, recursive and watch if different from defaults (= set by caller) only to avoid useless filter processing on data
  if (recursive !== defaults.recursive) recursive = utils.toBoolean(recursive);
  if (limit !== defaults.limit) {
    limit = utils.getInt(limit, 1); // get limit if Number or 1 at least (min)
    FileToSafe.prototype.limit = limit; // all future fileToSafe objects will be set with this limit or default constant LIMIT of class, so they will have this.limit access
  }
  if (watch !== defaults.watch) watch = utils.toBoolean(watch);

  let directory = new DirectoryToSafe(dirorfile, recursive);
  directory.getUnsafeRegexInFilesSync();
  directory.report();

  if (watch) { directory.watchUnsafeRegexInFiles(); return watch; }
  else if (directory.isUnsafe()) return false;
  else return true;
};

module.exports = safeReport;
module.exports.safeReportSync = safeReportSync;
module.exports.safe = safe;
