const _ = require('lodash')

const checkMaxValue = (testThis, maxVal) => {
  // pads the `testThis` value with zeros so that they can be
  // compared as strings without converting to an integer.
  const padded = ('00000000000000000000' + testThis).slice(-maxVal.length)
  return padded <= maxVal
}

module.exports.validators = {
  String: _.isString.bind(_),

  Integer: (val) => {
    const cleanVal = val.replace(/[,_]/, '')
    if (!/^-?\d+$/.test(cleanVal)) return false
    if (/^-/.test(cleanVal)) {
      if (!checkMaxValue(cleanVal.replace(/^-/, ''), '2147483648')) return false
    } else if (!checkMaxValue(cleanVal, '2147483647')) return false
    return _.isString(val)
  },

  DateTime: (val) => {
    // Checks that it is ISO an ISO formatted DateTime
    if (!/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ/.test(val)) return false
    try {
      if (new Date(val).toISOString() !== val) return false
    } catch (e) {
      return false
    }
    return true
  },

  BigDecimal: (val) => {
    const cleanVal = val.replace(/[,_]/, '')
    return /^-?\d+(\.\d*)?$/.test(cleanVal) || /^-?\.\d+$/.test(cleanVal)
  }
}
