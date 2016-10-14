const colors = require('colors/safe');

module.exports = `
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

- OPTION LIMIT : number of allowed repetitions in the entire regular expressions found (default 25)

$ safe-regex dir|file -limit|-l number
${colors.gray(`examples:
  safe-regex src/js/app.js -limit 50
  safe-regex src/js/app.js -l 35 -w`)}

- OPTION RECURSIVE : indicates whether all subdirectories should be tested or watched, or only the current directory (false by default)

$ safe-regex dir|file -recursive|-r
${colors.gray(`examples:
  safe-regex src/js/ -recursive
  safe-regex src/js/ -r -l 50 -w`)}

${colors.bgWhite.gray('--------------------------------------------- END HELP ---------------------------------------------')}
`;
