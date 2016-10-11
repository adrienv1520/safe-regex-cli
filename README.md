<img src="logo.png" alt="safe-regex-cli"/>

The command line tool for [safe-regex](https://github.com/substack/safe-regex) module to detect potentially catastrophic exponential-time regular expressions by limiting the star height to 1.

- Test regex in cli,
- get a report on unsafe file or unsafe directory of files,
- watch a file or a directory of files for unsafe regex.

## Installation

`npm install safe-regex-cli --save-dev`

`npm i safe-regex-cli -D`

## How does it work ?

safe-regex-cli can be :

- run in command line to **test a regex, get a report on a directory or a file and watch a directory or a file**.

- used in your Node application to **get an asynchronous report on unsafe directory or file**.

## How to use it

### Command line

Typically, use *safe-regex-cli* in command line when pretesting your app. If a file has unsafe regex, safe-regex exits process so scripts can be chained and a security issue will stop the chain. For an example, with npm scripts in *package.json* :

```javascript
{
  "name": "npm-industry",
  "version": "1.0.0",
  "description": "npm tool for web industrialisation : builder and deployer prototype for es6 project in CI and CD",
  "main": "index.js",
  "author": "Adrien Valcke <a.valcke@free.fr> (https://github.com/adrienvalcke)",
  "license": "MIT",
  "scripts": {
    "pretest": "eslint assets/scripts/** && safe-regex assets/scripts/",
    "test": "mocha test/"
  }
}
```

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

- **watch a directory or a file and get live reports**

  `$ safe-regex dir|file -w|-watch`

  Examples :

  ```
  $ safe-regex src/js/app.js -watch
  $ safe-regex src/js -w
  ```

- **limit option : number of allowed repetitions in the entire regular expressions found (default 25)**

  `$ safe-regex dir|file -limit|-l number`

  Example :

  ```
  $ safe-regex src/js/app.js -limit 50
  $ safe-regex src/js -l 35 -w
  ```

- **Note**: the first argument must be a string (regex) or a path to a directory or a file. Other arguments can be combined with no sorting requirements.

### Node module

Use it in your application.

#### safeReport(path[, {limit: 25, watch: false}], callback)

```javascript
const safeReport = require('safe-regex-cli');

safeReport('./src/js', (directory) => {
  directory.report();
});

// or
safeReport('./src/js', {limit: 90, watch: true}, (directory) => {
  // ...
});
```

## Contributing

Any advices or help will be greatly welcome. Feel free to contribute and make PR.

Please look at [TODO.md](./TODO.md) for work to be continued.
