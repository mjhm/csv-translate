const { Translator } = require('./src/translator')

module.exports.translate = async (config, inStream, outStream) => {
  const translator = new Translator(config, inStream, outStream)
  await translator.parse()
  if (translator.errors.length) {
    throw new Error('Completed with errors:\n' + translator.errors.join('\n'))
  }
}
