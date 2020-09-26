const Linter = require('standard-engine').linter

const opts = require('./options')
const linter = new Linter(opts)

const handleResult = (resolve, reject) => (e, r) => {
  if (e) {
    reject(e)
  } else {
    resolve(r)
  }
}

exports.lintGlob = (cwd, glob) =>
  new Promise((resolve, reject) =>
    linter.lintFiles(glob, { cwd, fix: false }, handleResult(resolve, reject))
  )

exports.lintText = (text, cwd, filename) =>
  new Promise((resolve, reject) =>
    linter.lintText(text, { cwd, filename, fix: false }, handleResult(resolve, reject))
  )
