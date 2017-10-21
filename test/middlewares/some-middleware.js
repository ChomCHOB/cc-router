module.exports.keyName = 'some-middleware'

module.exports.init = (router, {path, method, configs}) => {
  const keyName = module.exports.keyName
  if (typeof configs !== 'object' || !(keyName in configs)) return 0

  const config = configs[keyName]
  if (config) {
    router[method](path, (req, res, next) => {
      // console.log('some-middleware')
      res.header('x-some-middleware', 'some-middleware')
      next()
    })
  }
  return 1
}
