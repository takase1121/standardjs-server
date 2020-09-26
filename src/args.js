const mri = require('mri')

const argv = process.argv.slice(2)

module.exports = mri(argv, {
  string: ['port', 'token'],
  boolean: ['debug'],
  alias: { p: 'port', v: 'debug', t: 'token' },
  default: { port: 8080, debug: false, token: undefined }
})
