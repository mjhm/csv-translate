const Handlebars = require('handlebars')

// converts Date in form YYYY/MM/DD into an ISO DateTime object
Handlebars.registerHelper('date', function (options) {
  const dateStr = options.fn(this)
  const [year, month, day] = dateStr
    .split('/')
    .map((dstr) => parseInt(dstr, 10))
  return new Date(Date.UTC(year, month - 1, day)).toISOString()
})

module.exports.compile = (template) =>
  Handlebars.compile(template, { noEscape: true })
