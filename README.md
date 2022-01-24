# Quick Start

```
git clone git@github.com:mjhm/csv-translate.git
cd csv-translate
yarn

```
Then you can run 
```
yarn sample
```

This runs the `sample` command line in the `package.json` file.

Tests can be run with `yarn test`.

## Main Code files

- `cli.js` -- Command Line wrapper around `index.js`
- `index.js` -- Main entry point to code and wraps `src/translator.js`
- `src/`
  - `translator.js` -- Organizes the translation process with the parser, reading the config, running the translation, and output.
  - `parser.js` -- wraps Papa Parse CSV reader.
  - `template-compiler.js` -- wraps Handlebars which is used for defining and executing the translations
  - `data-validators.js` -- validation functions for typed data columns
  - `output/csv.js` -- wraps Papa Parse CSV writer.

## Architecture Flow

The program takes a JSON config file that defines how the incoming columns are translated into outgoing columns. It leverages the 'handlebars.js' library for injecting the incoming values into template strings. Handlebars is well documented, extensible, and mature (though perhaps overkill) for this application.

The parsing of the incoming JSON is via PapaParse. This has lots of flexibility of configuration for a variety of CSV conventions. The program allows for setting these options in the config file. PapaParse is used in a streaming mode, which should work well for large files or streaming data. As a consequence of streaming mode the lines are processed one at a time through the `processLine` callback. This ultimately does the data translation, validation, and output of each line.

## Config File

See `test/orders.config.json` for example and details.

## Assumptions and Simplifications

1. The only types that are validated are those mentioned in the sample: Integer, DateTime, BigDecimal, String. These are all assumed to be represented in both the input and output as strings, but are parsable into their respective types.  In particular DateTime is represented as an ISO formatted DateTime string.
2. I tested this for up to 10000 input lines, which takes about 1 second to run, I assume that this is acceeptable for now.
3. Instead of Handlebars I did my initial implementation with `lodash` templates. I switched to Handlebars because `lodash` templates expose the program to script injection via the config file. I assume the scenario in mind would ideally want a client to be able to define the config file, so exposing that vulnerablity is probably bad. The downside to this is that Handlebars helpers need to be built into the code base rather than allowing code level customization in the config file.

## Next Steps

Most of the next steps depend on product priorities and specific applications of the code. My best guesses for next steps:
1. It would be that it would be handy to have a SQL output option.
2. Review details of the PapaParse input and output config to see if that matches the real world expectations.
3. Convert to TypeScript.
4. More testing for real world situations.
   


