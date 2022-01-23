const Papa = require('papaparse')

class Parser {
  constructor(processHeader, processLine, parseOptions) {
    const self = this
    this.processHeader = processHeader
    this.parseOptions = {
      ...parseOptions,
      step: (...args) => {
        if (self.processHeader) {
          processHeader(...args)
          self.processHeader = null
        } else {
          processLine(...args)
        }
      }
    }
  }

  parse(inStream) {
    const self = this
    const completePromise = new Promise((resolve, reject) => {
      self.resolve = resolve
      self.reject = reject
    })
    Papa.parse(inStream, {
      ...this.parseOptions,
      complete: () => {
        self.resolve()
      },
      error: (err) => {
        console.reject(err)
      }
    })
    return completePromise
  }
}

module.exports.Parser = Parser
