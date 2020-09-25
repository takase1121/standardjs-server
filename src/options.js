const eslint = require('eslint')
const path = require('path')
const pkg = require('../package.json')

module.exports = {
  version: pkg.version,
  homepage: pkg.homepage,
  bugs: pkg.bugs.url,
  eslint,
  cmd: 'standardjs-server',
  tagline: "Because you can, doesn't mean you should",
  eslintConfig: {
    configFile: path.join(__dirname, 'eslintrc.json')
  },
  cwd: ''
}
