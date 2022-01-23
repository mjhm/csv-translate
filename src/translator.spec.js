const path = require('path')
const { Writable, PassThrough } = require('stream')
const { Translator } = require('./translator')

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

const testData = `Order Number,Year,Month,Day,Product Number,Product Name,Count,Extra Col1,Extra Col2,Empty Column
1000,2018,1,1,P-10001,Arugola,"5,250.50",Lorem,Ipsum,
1001,2017,12,12,P-10002,Iceberg lettuce,500.00,Lorem,Ipsum,
`

describe('Translator config', () => {
  let inStream, outStream
  beforeEach(() => {
    inStream = new PassThrough()
    outStream = new WriteMemory()
  })

  test('translation missing', () => {
    expect(() => new Translator('garbage config', inStream, outStream)).toThrow(
      'translation section missing from config'
    )
  })

  test('translation not an object', () => {
    expect(
      () => new Translator({ translation: 'garbage' }, inStream, outStream)
    ).toThrow(`config translation object doesn't have any keys`)
  })

  test('translation value missing type', () => {
    const testConfig = { translation: { testkey: {} } }
    expect(() => new Translator(testConfig, inStream, outStream)).toThrow(
      `config type "undefined" for "testkey" is not a valid type`
    )
  })

  test('translation value missing template', () => {
    const testConfig = { translation: { testkey: { type: 'String' } } }
    expect(() => new Translator(testConfig, inStream, outStream)).toThrow(
      `config template for "testkey" is not a string`
    )
  })
})

describe('Translator translation', () => {
  let inStream, outStream
  beforeEach(() => {
    inStream = new PassThrough()
    outStream = new WriteMemory()
  })

  test('extract a single column as strings', async () => {
    inStream.write(testData)
    const translator = new Translator(
      { translation: { OrderNumber: `{{'Order Number'}}` } },
      inStream,
      outStream
    )
    inStream.end()
    await translator.parse()
    expect(outStream.buffer).toEqual('OrderNumber\n1000\n1001\n')
    // console.error('outStream', outStream.buffer)
  })

  test('validate Integer', async () => {
    inStream.write(testData)
    const translator = new Translator(
      {
        translation: {
          OrderNumber: { type: 'Integer', template: `{{'Order Number'}}` }
        }
      },
      inStream,
      outStream
    )
    inStream.end()
    await translator.parse()
    expect(outStream.buffer).toEqual('OrderNumber\n1000\n1001\n')
    // console.error('outStream', outStream.buffer)
  })
})

describe('Stress Test', () => {
  let inStream, outStream
  beforeEach(() => {
    inStream = new PassThrough()
    outStream = new WriteMemory()
  })

  test('10000 lines in a second', async () => {
    inStream.write(
      'Order Number,Year,Month,Day,Product Number,Product Name,Count,Extra Col1,Extra Col2,Empty Column\n'
    )
    const baseLine = '2018,1,1,P-10001,Arugola,"5,250.50",Lorem,Ipsum,\n'
    for (let i = 0; i < 10000; i += 1) {
      inStream.write(`${i + 1000},${baseLine}`)
    }
    const config = require(path.resolve('./test/orders.config'))
    const translator = new Translator(config, inStream, outStream)
    inStream.end()
    const startParse = new Date().getTime()
    await translator.parse()
    const elapsed = new Date().getTime() - startParse
    expect(elapsed).toBeLessThan(1000)
  })
})
