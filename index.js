const fs = require('fs')
const path = require('path')
const express = require('express')
const debug = require('debug')('cc-router')

let _appExpress = false
let _hasMiddleware = false
let _rootDirPath
let _routesDirPath
let _middlewaresDirPath

function _loadMiddleware (router, routeConfig) {
  fs.readdirSync(_middlewaresDirPath)
    // Sort file name
    .sort((a, b) => (a < b ? -1 : 1))
    // Load only .js file
    // Ignore file index.js
    // Ignore file begin with x-
    .filter(file => (file.indexOf('.js') > 0) && file !== 'index.js' && file.search(/^x-/) === -1)
    .forEach((file) => {
      // const filename = `${file.substr(0, file.length - 3)}`
      const _middleware = require(path.join(_middlewaresDirPath, file))
      let _retVal

      if (_middleware) {
        if (typeof _middleware === 'function') {
          _retVal = _middleware(router, routeConfig)
        } else if ('init' in _middleware && typeof _middleware.init === 'function') {
          _retVal = _middleware.init(router, routeConfig)
        }
      } else {
        throw new Error(`cannot init middleware ${file}: no init function`)
      }

      if (_retVal) debug(`middleware loaded: ${file}`)
    })
  return true
}

function _addRoute (router, _route = { method: '', path: '' }) {
  const _method = _route.method.toLowerCase()
  const _path = _route.path.toLowerCase()
  const routeConfig = {
    method: _method,
    path: _path,
    configs: _route.configs,
    logData: _route.logData,
  }

  if (Object.prototype.hasOwnProperty.call(_route, 'x')) return false

  // ignore route if environment mismatch
  if (Object.prototype.hasOwnProperty.call(_route, 'env')) {
    if (typeof process.env.NODE_ENV !== 'string') return false
    // env is a string
    else if (typeof _route.env === 'string' && process.env.NODE_ENV !== _route.env) return false
    // env is an array
    else if (Array.isArray(_route.env) && !_route.env.includes(process.env.NODE_ENV)) return false
  }

  // check route handler
  if (!_route.handler || typeof (_route.handler) !== 'function') {
    throw new Error(`route handler required! (method: ${_method}, path: ${_path})`)
  }

  debug(`route: '${_method}' - ${_path}`)

  // Add middlewares
  if (_hasMiddleware) {
    _loadMiddleware(router, routeConfig)
  }

  router[_method](_path, _route.handler)

  return true
}

function _addRoutes (routes, baseRoute) {
  const isArray = Array.isArray(routes)
  const isObject = typeof routes === 'object'
  let router
  let cntRoute = 0

  router = express.Router()

  if (isArray) {
    routes.forEach((_route) => {
      if (!_route.method || typeof _route.method !== 'string') {
        return console.warn(`route "${_route.path}" method or type must be defined!`)
      }

      if (_appExpress && _route.method) {
        _addRoute(router, _route)
        cntRoute += 1
      }
    })
  } else if (isObject) {
    // TODO: add object route parsing
    console.warn('  object type not supported!')
  }

  if (_appExpress && cntRoute > 0) {
    debug(`express:  ${baseRoute}`)
    _appExpress.use(baseRoute, router)
  }
  return true
}

function _mountRoutes (
  baseRoute,
  dirName,
  dirPath,
  lv) {
  const normalizedPath = dirPath

  fs.readdirSync(normalizedPath)
    .sort((a, b) => (a < b ? -1 : 1))
    .forEach((file) => {
      const _file = file.toLowerCase()
      let space = ''

      for (let i = 0; i < lv; i += 1) space += '  '

      if (file.indexOf('.js') >= 0) {
        // file
        const _filename = (_file === 'index.js')
          ? ''
          : `${_file.substr(0, _file.length - 3)}`
        const newBaseRoute = file === 'index.js'
          ? (baseRoute || '/')
          : `${baseRoute}/${_filename}`

        debug(`${space}route path: ${newBaseRoute} - (${path.join(dirPath, file)})`)
        const routeFile = require(path.join(dirPath, file))

        if (typeof routeFile === 'function') {
          _addRoutes(routeFile(), newBaseRoute)
        } else {
          _addRoutes(routeFile, newBaseRoute)
        }
      } else {
        // directory
        // make /v1   to  /v1/foo
        const _newBasePath = `${baseRoute}/${file}`
        // make /v1/  to  /v1/foo/
        const _newDirPath = path.join(dirPath, file) // `${dirPath}${file}/`

        // debug('directory  : ' + file)
        // debug('base path  : ' + _newBasePath)
        // debug('dir path   : ' + _newDirPath)

        _mountRoutes(_newBasePath, file, _newDirPath, lv + 1)
      }
    })
}

module.exports = function init (
  appExpress,
  rootDirPath,
  routesDirPath,
  middlewaresDir = false) {
  // check require var
  if (typeof rootDirPath !== 'string') throw new Error(`'rootDirPath' must be a string`)
  if (typeof routesDirPath !== 'string') throw new Error('`routesDirPath` must be a string')
  if (!appExpress || typeof appExpress !== 'function') throw new Error('appExpress must be valid')
  _appExpress = appExpress

  // Check router directory exist
  _rootDirPath = rootDirPath
  _routesDirPath = path.join(_rootDirPath, routesDirPath)

  debug(`route dir: ${_routesDirPath}`)

  try {
    fs.accessSync(_routesDirPath, fs.F_OK)
  } catch (e) {
    throw new Error(`route directory not found! (${_routesDirPath})`)
  }

  // Check middleware directory exist
  _middlewaresDirPath = false
  _hasMiddleware = false
  if (typeof middlewaresDir === 'string') {
    try {
      _middlewaresDirPath = path.join(_rootDirPath, middlewaresDir)
      fs.accessSync(_middlewaresDirPath, fs.F_OK)
      _hasMiddleware = true
    } catch (e) {
      debug('express middleware dir not found!')
      _middlewaresDirPath = false
      _hasMiddleware = false
    }
  }

  // create router
  _mountRoutes('', '', _routesDirPath, 0)
}

module.exports._addRoute = _addRoute
