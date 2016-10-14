<img src="logo.png" alt="safe-regex-cli"/>

The command line tool for the [safe-regex](https://github.com/substack/safe-regex) module to detect potentially catastrophic exponential-time regular expressions by limiting the star height to 1. Use *safe-regex-cli* to ensure your regular expressions are not susceptible of regular expression denial of service (ReDOS) attacks.

- Test a simple regex in cli,
- get a report on a file or a directory of files,
- watch a file or a directory of files for unsafe regex live.

## Installation

`npm install safe-regex-cli --save-dev`

`npm i safe-regex-cli -D`

## How does it work ?

safe-regex-cli can be :

- run in command line to **test a regex, get a report on a directory or a file and watch a directory or a file**.

- used in your Node application to **get an asynchronous report on unsafe directory or file**.

## How to use it

### Command line

Typically, use *safe-regex-cli* in command line when pretesting your app. If a file has unsafe regex, *safe-regex-cli* exits process so scripts/commands can be chained and a regex security issue will stop the chain. For an example, with npm scripts in *package.json* :

```javascript
{
  "name": "npm-industry",
  "version": "1.0.0",
  "description": "npm tool for web industrialisation : builder and deployer prototype for es6 project in CI and CD",
  "main": "index.js",
  "author": "Adrien Valcke <a.valcke@free.fr> (https://github.com/adrienvalcke)",
  "license": "MIT",
  "scripts": {
    "pretest": "eslint assets/scripts/** && safe-regex assets/scripts",
    "test": "mocha test/"
  }
}
```

There will be no mocha testing if *safe-regex-cli* find an unsafe regex in "assets/scripts" directory (process exits).

- **detect an unsafe regex**

  `$ safe-regex string`

  Example :

  `$ safe-regex '(a+){10}'`

- **get a report on each file of a directory**

  `$ safe-regex dir`

  Example :

  `$ safe-regex src/js`

- **get a report on one file**

  `$ safe-regex file`

  Example :

  `$ safe-regex src/js/app.js`

- **recursive option : indicates whether all subdirectories should be tested or watched, or only the current directory (default false)**

  `$ safe-regex dir|file -recursive|-r`

  Examples :

  ```
  $ safe-regex src/js -recursive
  $ safe-regex src/js -r -l 50 -w
  ```
- **limit option : number of allowed repetitions in the entire regular expressions found (default 25)**

  `$ safe-regex dir|file -limit|-l number`

  Examples :

  ```
  $ safe-regex src/js/app.js -limit 50
  $ safe-regex src/js -l 35 -w
  ```
- **watch option: watch a directory or a file and get live reports (default false)**

  `$ safe-regex dir|file -w|-watch`

  Examples :

  ```
  $ safe-regex src/js/app.js -watch
  $ safe-regex src/js -w
  ```

- **help**

  `$ safe-regex -help|-h`


- **Note**: the first argument must be a string (regex) or a path to a directory or a file. Other arguments can be combined with no sorting requirements.

### Node module

Use it in your application.

#### safeReport(path[, {recursive: false, limit: 25, watch: false}], callback)

```javascript
const safeReport = require('safe-regex-cli');

safeReport('./src/js', (directory) => {
  directory.report();
});

// or
safeReport('./src/js', {recursive: true, limit: 90, watch: true}, (directory) => {
  // ...
});
```

## Contributing

Any advices or help will be greatly welcome. Feel free to contribute and make PR.

Please look at [TODO.md](./TODO.md) for work to be continued.
