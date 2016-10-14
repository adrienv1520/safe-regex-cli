#! /usr/bin/env node
// sudo npm link

const help = require('./help');

const utils = require('../lib/utils');
const safeReportSync = require('../lib').safeReportSync;
const safe = require('../lib').safe;
const safeReport = require('../lib');

const colors = require('colors/safe');

const [,, regexorpath, ...args] = [...process.argv];

if (!regexorpath || regexorpath === '-help' || regexorpath === '-h' || ~args.indexOf('-help') || ~args.indexOf('-h')) {
  console.log(help);
} else {
  let limit = 25,
      watch = false,
      recursive = false;

  // get options in args

  let index = 0;

  // recursive
  if (~args.indexOf('-recursive') || ~args.indexOf('-r')){
    recursive = true;
  }

  // limit
  if (~(index = args.indexOf('-limit')) || ~(index = args.indexOf('-l'))){
    limit = utils.getInt(args[index + 1], 1); // get at least 1
  }

  // watch
  if (~args.indexOf('-watch') || ~args.indexOf('-w')){
    watch = true;
  }

  // if regexorpath does not exist, it may be a simple string regex
  if (!utils.existsSync(regexorpath)) {
    const isSafe = safe(regexorpath, {limit: limit});
    if (isSafe) console.log(`'${regexorpath}' is ${colors.green('safe')}.`);
    else console.log(`'${regexorpath}' is ${colors.red('not safe')}.`);
  } else {
    // now we have options, operate on file(s) to get a report from unsafe regexp
    const safe = safeReportSync(regexorpath, recursive, limit, watch);

    /* if watch, safe = true so we can wait for file changes
       else if safe === false safeReportSync has found unsafe regex in file(s)
       else safe = true safeReportSync has found no unsafe regex */
    if (!safe) process.exit(1); // STOP PROCESS so we can chain command and a regex security issue will stop it : safe-regex src/js/ && eslint src/js/** && ...
  }
}
