const { compile } = require('./template-compiler')

describe('handlebars sanity check', () => {
  test('simple template translation', () => {
    const translator = compile("{{normalKey}} and {{'multi word key'}}")
    const data = {
      normalKey: 'normalKeysValue',
      'multi word key': 'multi word keys value'
    }
    expect(translator(data)).toEqual(
      'normalKeysValue and multi word keys value'
    )
  })
})

describe('date helper', () => {
  const translator = compile('{{#date}}{{from}}{{/date}}')
  const fromTo = [
    ['2010/1/1', '2010-01-01T00:00:00.000Z'],
    ['2010/01/01', '2010-01-01T00:00:00.000Z'],
    ['2011/02/29', '2011-03-01T00:00:00.000Z'], // Not a leap year
    ['82/1/1', '1982-01-01T00:00:00.000Z']
  ]

  fromTo.forEach(([from, to]) => {
    test(`${from} should translate to ${to}`, () => {
      expect(translator({ from })).toEqual(to)
    })
  })

  test('Invalid date', () => {
    expect(() => translator({ from: 'blah' })).toThrow('Invalid time value')
  })
})
