exports.collectData = req =>
  new Promise((resolve, reject) => {
    const data = []
    const flush = () => resolve(Buffer.concat(data))
    req.on('data', d => data.push(d))
    req.once('end', flush)
    req.once('close', flush)
    req.once('error', e => reject(e))
  })
