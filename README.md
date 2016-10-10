<img src="logo.png" alt="safe-regex-cli"/>

The command line tool for [safe-regex](https://github.com/substack/safe-regex) module to detect potentially catastrophic exponential-time regular expressions by limiting the star height to 1.

- Test regex in cli,
- get a report on unsafe file or unsafe directory of files,
- watch a file or a directory of files for unsafe regex.

## Installation

`npm install safe-regex-cli --save-dev`

## How does it work ?

safe-regex-cli can be :

- run in command line to **test a regex, get a report on a directory or a file and watch a directory or a file**.

- used in your Node application to **get an asynchronous report on unsafe directory or file**.

## How to use it

### Command line

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
  `$ safe-regex src/js/app.js`)}

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

Use it in your application :

```javascript
const safeReport = require('safe-regex-cli');
// safeReport(path[, limit, watch])
// defaults : limit = 25, watch = false
safeReport('./src/js');
```

## Contributing

Any advices or help will be greatly welcome. Feel free to contribute and make PR.

Here's some work that is still not finished :

  - Test application
  - Add support to '\*.ext' path in DirectoryToSafe(dirorfile) function
