const { OutputCsv } = require('./csv')
const { Writable } = require('stream')

class WriteMemory extends Writable {
  constructor() {
    super()
    this.buffer = ''
  }

  _write(chunk, _, next) {
    this.buffer += chunk
    next()
  }

  reset() {
    this.buffer = ''
  }
}

describe('csv basic output', () => {
  test('header and data', () => {
    const outStream = new WriteMemory()
    const outputCsv = new OutputCsv(outStream)
    outputCsv.outputHeader(['first col title', 'second col title'])
    outputCsv.outputLine(['first col data', 'second col data'])
    expect(outStream.buffer).toEqual(
      [
        'first col title,second col title\n',
        'first col data,second col data\n'
      ].join('')
    )
  })
})
