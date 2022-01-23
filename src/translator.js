const _ = require('lodash')
const { compile } = require('./template-compiler')
const { Parser } = require('./parser')
const { OutputCsv } = require('./output/csv')
const { validators } = require('./data-validators')

const validTypes = Object.keys(validators)

class Translator {
  constructor(config, inStream, outStream) {
    this.inStream = inStream
    this.inHeader = null // this will be filled when first line is read
    this.errors = []
    this.lineCount = 0

    if (!config.translation) {
      throw new Error('translation section missing from config')
    }
    if (
      !_.isPlainObject(config.translation) ||
      Object.keys(config.translation).length === 0
    ) {
      throw new Error(`config translation object doesn't have any keys`)
    }

    const translation = _.omit(config.translation, '//') // ignoring config comments
    this.outHeader = Object.keys(translation)

    this.translators = _.mapValues(translation, (v, k) => {
      const columnType = _.isString(v) ? 'String' : v.type
      if (!validTypes.includes(columnType)) {
        throw new Error(
          `config type "${columnType}" for "${k}" is not a valid type`
        )
      }
      const template = _.isString(v) ? v : v.template
      if (!_.isString(template)) {
        throw new Error(`config template for "${k}" is not a string`)
      }
      return {
        type: columnType,
        translator: compile(template)
      }
    })

    // Parses the file line by line and hands off each line to processors.
    this.parser = new Parser(
      this.processHeader.bind(this),
      this.processLine.bind(this),
      config.parseOptions
    )

    // Output is abstracted out so that this is extensible to say writing SQL.
    this.output = new OutputCsv(outStream)
  }

  processHeader({ data, errors, meta }) {
    this.inHeader = data
    this.output.outputHeader(this.outHeader)
  }

  processLine({ data, errors, meta }) {
    const inObj = _.zipObject(this.inHeader, data)
    this.errors.push(...errors)
    this.lineCount += 1
    const outObj = _.mapValues(this.translators, (tr) => {
      const translated = tr.translator(inObj)
      if (!validators[tr.type](translated)) {
        this.errors.push(
          `line: ${this.lineCount} value ${translated} doesn't match type ${tr.type}`
        )
      }
      return translated
    })
    this.output.outputLine(this.outHeader.map((h) => outObj[h]))
  }

  async parse() {
    await this.parser.parse(this.inStream)
    await this.output.outputFooter()
  }
}

module.exports.Translator = Translator
