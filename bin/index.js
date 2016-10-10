#! /usr/bin/env node
// sudo npm link

const colors = require('colors/safe');
const utils = require('../lib/utils');
const safeReportSync = require('../lib').safeReportSync;
const safe = require('../lib').safe;

const help =
`
${colors.bgWhite.gray('----------------------------------------------- HELP -----------------------------------------------')}

${colors.red(`The command line tool for safe-regex module to detect
potentially catastrophic exponential-time regular expressions.`)}

- SAFE A REGEX

$ safe-regex string
${colors.gray(`example:
  safe-regex '(a+){10}'`)}

- SAFE EACH FILE OF A DIRECTORY

$ safe-regex dir
${colors.gray(`example:
  safe-regex src/js`)}

- SAFE ONE FILE

$ safe-regex file
${colors.gray(`example:
  safe-regex src/js/app.js`)}

- SAFE WATCHING A FILE OR A DIRECTORY

$ safe-regex dir|file -w|-watch
${colors.gray(`examples:
  safe-regex src/js/app.js -watch
  safe-regex src/js/app.js -w`)}

- OPTION : number of allowed repetitions in the entire regular expressions found (default 25)

$ safe-regex dir|file -limit|-l number
${colors.gray(`examples:
  safe-regex src/js/app.js -limit 50
  safe-regex src/js/app.js -l 35 -w`)}

${colors.bgWhite.gray('--------------------------------------------- END HELP ---------------------------------------------')}
`;

var userArgs = process.argv.slice(2);

if (!userArgs[0] || ~userArgs.indexOf('-help') || ~userArgs.indexOf('--help') || ~userArgs.indexOf('-h')) {
  console.log(help);
} else {
  let dirorfile = userArgs[0],
      limit = 25,
      watch = false;

  // get options
  let index = 0;

  // limit
  if (~(index = userArgs.indexOf('-limit')) || ~(index = userArgs.indexOf('-l'))){
    limit = utils.getInt(userArgs[index + 1], 1); // get at least 1
  }

  // watch
  if (~userArgs.indexOf('-watch') || ~userArgs.indexOf('-w')){
    watch = true;
  }

  // if dirorfile does not exist, it may be a regex
  if (!utils.existsSync(dirorfile)) {
    let isSafe = safe(dirorfile, {limit: limit});
    if (isSafe) console.log(`'${dirorfile}' is ${colors.green('safe')}.`);
    else console.log(`'${dirorfile}' is ${colors.red('not safe')}.`);
  } else {
    // now we have options, operate on file(s) to get a report from unsafe regexp
    safeReportSync(dirorfile, limit, watch);
  }
}