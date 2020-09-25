const Linter = require('standard-engine').linter
const mri = require('mri')
const polka = require('polka')

const opts = require('./options')
const linter = new Linter(opts)

const args = mri(process.argv.slice(2), {
  string: ['port'],
  boolean: ['debug'],
  alias: { p: 'port', v: 'debug' },
  default: { port: 8080, debug: false }
})

const formatLint = filePath => ({ line, column, message }) => `${filePath}:${line}:${column}: ${message}\n`
const lintGlob = (req, res) => {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`)
  if (!searchParams.has('cwd') || !searchParams.has('glob')) {
    res.writeHead(400).end()
    return
  }

  if (args.debug) {
    console.log(`Request: { cwd: '${searchParams.get('cwd')}', file: '${searchParams.get('glob')}' }`)
  }

  linter.lintFiles(searchParams.get('glob'), {
    cwd: searchParams.get('cwd'),
    fix: false
  }, (e, { results }) => {
    if (e) {
      console.error(e)
      res.writeHead(500).end()
      return
    }
    const messages = results.reduce(
      (output, item) => [...output, ...item.messages.map(formatLint(item.filePath))],
      []
    )
    messages.forEach(message => res.write(message))
    res.end()
  })
}

let { port } = args
if (Number.isNaN(port)) port = Number(port)

polka()
  .get('/lint', lintGlob)
  .listen(port, err => {
    if (err) throw err
    console.log(`Server started at ${port}`)
  })
