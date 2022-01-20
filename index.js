const Papa = require('papaparse')
const _ = require('lodash')

class Translator {
  constructor(configFile, inStream, outStream) {
    this.configFile = configFile
    this.inStream = inStream
    this.outStream = outStream
    this.inHeader = null
    const rawConfig = require(configFile)
    this.outHeader = Object.keys(rawConfig.translation)
    this.parseOptions = rawConfig.parseOptions
    this.outHeader = Object.keys(rawConfig.translation)
    this.outTypes = _.mapValues(rawConfig.translation, (v) =>
      _.isString(v) ? 'string' : v.type || 'string'
    )
    this.translators = _.mapValues(rawConfig.translation, (v) => {
      const template = _.isString(v) ? v : v.template
      return _.template(template)
    })
    console.log('this.outTypes', this.outTypes)
    console.log('this.translators', this.translators)
  }

  processLine({ data, errors, meta }) {
    console.log('data', data)

    if (!this.inHeader) {
      this.inHeader = data
      return
    }
    const inObj = _.zipObject(this.inHeader, data)
    inObj.key = inObj
    const outObj = _.mapValues(this.translators, (tr) => tr(inObj))
    console.log('outObj', outObj)
  }

  parse() {
    Papa.parse(this.inStream, {
      step: this.processLine.bind(this)
    })
  }
}

module.exports.translate = (configFile, inStream, outStream) => {
  const translator = new Translator(configFile, inStream, outStream)
  translator.parse()
  // console.log(configFile, inStream, outStream)
  // const papaStream = Papa.parse(inStream, { chunk: processData })
  // console.log('papaStream', papaStream)
  // papaStream.on('data', (data) => processData)
  // papaStream.on('end', () => inStream.unpipe(papaStream))
  // inStream.pipe(papaStream)
}
