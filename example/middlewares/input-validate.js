const validator = require('express-validation')

module.exports.keyName = 'validate'

module.exports.init = (router, {path, method, configs}) => {
  const keyName = module.exports.keyName
  // check configs match with `validate`
  if (configs && keyName in configs && typeof configs[keyName] === 'object') {
    router[method](path, validator(configs[keyName]))
    return true
  }
}
