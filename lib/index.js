/**
 * safe-regex-cli © 2016 Adrien Valcke
 *
 * The command line tool for the safe-regex module to ensure your regular expressions
 * are not susceptible of regular expression denial of service (ReDOS) attacks.
 * Get a report on a file or a directory of files,
 * watch a file or a directory of files for unsafe regex live
 * or test a regex in cli.
 *
 * lib index, synchronous and asynchronous reports.
 */
const utils = require('./utils');
const defaults = require('./defaults');
const DirectoryToSafe = require('./models/DirectoryToSafe.class');
const FileToSafe = require('./models/FileToSafe.class');

const safe = require('safe-regex');

/** ENTRY POINT FOR CLI
 * safeReport Synchronous function to get a report on unsafe regex found in files
 * @param  {Object}  with these properties :
 *   {String}  dirorfile     path to a directory or a file
 *   {Boolean} recursive     indicates whether all subdirectories should be tested or watched, or only the current directory (false by default)
 *   {Number}  limit         number of allowed repetitions in the entire regular expressions found (default 25)
 *   {Boolean} watch         watch or not files when changing
 */
const safeReportSync = function safeReportSync({dirorfile = '', recursive = defaults.recursive, limit = defaults.limit, watch = defaults.watch}) {

  // filter option 'watch' only, 'limit' and 'recursive' are filtered in DirectoryToSafe constructor
  // only if different from defaults (= set by caller) to avoid useless filter processing on data
  if (watch !== defaults.watch) watch = utils.toBoolean(watch);

  const directory = new DirectoryToSafe({dirorfile, recursive, limit});
  directory.getUnsafeRegexInFilesSync();
  directory.report();

  if (watch) { directory.watchUnsafeRegexInFiles(); return watch; }
  else if (directory.isUnsafe()) return false;
  else return true;
};

/** MAIN ENTRY POINT FOR API : const safeReport = require('safe-regex-cli');
 * safeReport Asynchronous function to get a report on unsafe regex files
 * @param  {String}     dirorfile     path to a directory or a file
 * @param  {Object}     options       recursive, limit, watch
 * @param  {Function}   callback      callback
 */
const safeReport = function safeReport(dirorfile, options, callback) {
  let recursive,
      limit,
      watch,
      cb = callback;

  // if no options then options is the callback
  if (utils.is(options, Function)) {
    cb = options;
  } else {
    // check options like this because options can be a missing parameter and we need to filter option watch (recursive and limit will be filtered in DirectoryToSafe constructor)
    // otherwise we could do const {recursive = defaults.recursive, limit = defaults.limit, watch = defaults.watch} in parameter replacing options
    recursive = options.recursive || defaults.recursive;
    limit = options.limit || defaults.limit;
    watch = options.watch || defaults.watch;
    if (watch !== defaults.watch) watch = utils.toBoolean(watch);
  }

  const directory = new DirectoryToSafe({dirorfile, recursive, limit});
  directory.getUnsafeRegexInFiles(() => {
    if (watch) {
      directory.report();
      directory.watchUnsafeRegexInFiles();
    }
    else cb(directory);
  });
};

module.exports = safeReport;
module.exports.safeReportSync = safeReportSync;
module.exports.safe = safe;
