const path = require('path')
const { program } = require('commander')
const { translate } = require('./index.js')

program.requiredOption('-c, --configFile <path>', 'required configuation file')
program.parse(process.argv)

const { configFile } = program.opts()
const config = require(path.resolve(configFile))
translate(config, process.stdin, process.stdout)
