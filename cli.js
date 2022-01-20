const { program } = require('commander')
const { translate } = require('./index.js')

program.requiredOption('-c, --configFile <path>', 'required configuation file')
program.parse(process.argv)

const { configFile } = program.opts()
console.log('program.opts', program.opts())
console.log('translate', translate)
translate(configFile, process.stdin, process.stdout)
