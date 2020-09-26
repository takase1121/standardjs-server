const polka = require('polka')
let { port, token, debug: debugEnabled } = require('./args')
const { lintGlob, lintText } = require('./linter')
const { collectData } = require('./util')
const debug = (...args) => debugEnabled && console.log(...args)

const formatOut = filePath => ({ line, column, message }) => `${filePath}:${line}:${column}: ${message}\n`
const hasParams = url => url.searchParams.has('cwd') && url.searchParams.has('file')
const sendLint = (res, results) =>
  results.reduce(
    (output, item) => [...output, ...item.messages.map(formatOut(item.filePath))],
    []
  ).forEach(message => res.write(message))

// middlewares
const logRequests = (req, res, next) => {
  debug(`Request from '${req.url}'`)
  next()
}
const authorizeRequests = (req, res, next) => {
  req.parsedUrl = new URL(req.url, 'http://example.com')
  if (req.headers.authorization !== token) return res.writeHead(401).end()
  if (!hasParams(req.parsedUrl)) return res.writeHead(400).end()
  next()
}

port = Number(port)
polka()
  .use(logRequests, authorizeRequests)
  .get('/lintGlob', async (req, res) => {
    const { searchParams } = req.parsedUrl
    const [cwd, file] = [searchParams.get('cwd'), searchParams.get('file')]
    try {
      const { results } = await lintGlob(cwd, file)
      sendLint(res, results)
      res.end()
    } catch (e) {
      console.error(e)
      res.writeHead(500).end(e.message)
    }
  })
  .post('/lintText', async (req, res) => {
    const { searchParams } = req.parsedUrl
    const [cwd, file] = [searchParams.get('cwd'), searchParams.get('file')]
    try {
      const rawBody = await collectData(req)
      const body = rawBody.toString('utf-8')
      const { results } = await lintText(body, cwd, file)
      sendLint(res, results)
      res.end()
    } catch (e) {
      console.error(e)
      res.writeHead(500).end(e.message)
    }
  })
  .listen(port, err => {
    if (err) throw err
    console.log(`Server started at ${port}`)
  })
