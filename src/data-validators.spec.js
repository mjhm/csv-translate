const { validators } = require('./data-validators')

describe('Validate Integer', () => {
  test('in range positive', () => {
    expect(validators.Integer('234')).toEqual(true)
  })

  test('in range negative', () => {
    expect(validators.Integer('-234')).toEqual(true)
  })

  test('boundary negative', () => {
    expect(validators.Integer('-2147483648')).toEqual(true)
  })

  test('past boundary negative', () => {
    expect(validators.Integer('-2147483649')).toEqual(false)
  })

  test('past boundary positive', () => {
    expect(validators.Integer('2147483648')).toEqual(false)
  })
})

describe('Validate DateTime', () => {
  test('garbage', () => {
    expect(validators.DateTime('garbage')).toEqual(false)
  })

  test('valid ISO string', () => {
    expect(validators.DateTime('2017-12-12T00:00:00.000Z')).toEqual(true)
  })

  test('invalid month', () => {
    expect(validators.DateTime('2017-13-12T00:00:00.000Z')).toEqual(false)
  })

  test('invalid day on non leap year', () => {
    expect(validators.DateTime('2017-02-29T00:00:00.000Z')).toEqual(false)
  })
})

describe('Validate BigDecimal', () => {
  const validateThese = [
    ['garbage', false],
    ['999.99', true],
    ['876', true],
    ['.895', true],
    ['-.85478', true],
    ['-45.0', true],
    ['888_569.345', true],
    ['abc.def', false]
  ]
  validateThese.forEach(([testThis, result]) => {
    test(`${testThis} should validate to ${result}`, () => {
      expect(validators.BigDecimal(testThis)).toEqual(result)
    })
  })
})
