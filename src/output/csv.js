const Papa = require('papaparse')

class OutputCsv {
  constructor(outStream) {
    this.outStream = outStream
  }

  outputHeader(data) {
    this.outStream.write(Papa.unparse([data], { header: true }))
    this.outStream.write('\n')
  }

  outputLine(data) {
    this.outStream.write(Papa.unparse([data], { header: false }))
    this.outStream.write('\n')
  }

  outputFooter() {
    return Promise.resolve()
  }
}

module.exports.OutputCsv = OutputCsv
