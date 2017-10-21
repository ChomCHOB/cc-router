const chai = require('chai')
const path = require('path')
const express = require('express')
const request = require('supertest')
const async = require('async')
const expect = chai.expect
let router
let appExpress

describe('router', function () {
  beforeEach(function (done) {
    appExpress = express()
    router = require('../index')
    done()
  })

  afterEach(function (done) {
    appExpress = undefined
    router = undefined
    done()
  })

  it('should not error when no middleware', function (done) {
    done()
  })

  it('should match dirname', function () {
    const basePath = path.join(__dirname, 'routes')

    // console.log(basePath);
    expect(basePath).to.match(/test\/routes/)
  })

  it('should success route with all word', (done) => {
    const rootDir = __dirname
    const routesDir = 'routes'
    router(appExpress, rootDir, routesDir)

    async.parallel([
      function (cb) {
        request(appExpress)
          .get('/v2')
          .expect(200)
          .end(cb)
      },
      function (cb) {
        request(appExpress)
          .post('/v1/ping2')
          .expect(200)
          .end(cb)
      },
      function (cb) {
        request(appExpress)
          .post('/ping2')
          .expect(200)
          .end(cb)
      },
      function (cb) {
        request(appExpress)
          .put('/v2/test-v2/user/123')
          .expect(200)
          .end(cb)
      },
      function (cb) {
        request(appExpress)
          .delete('/v3/user/123')
          .expect(200)
          .end(cb)
      }
    ], (err) => {
      if (err) return done(err)
      // console.log('done!');
      done()
    })
  })

  it('should success with all get routes', function (done) {
    const rootDir = __dirname
    const routesDir = 'routes'
    router(appExpress, rootDir, routesDir)

    const testRoutes = [
      '/', '/back',
      '/v1', '/v1/ping', '/v1/test', '/v1/test/ping',
      '/v2', '/v2/ping', '/v2/test-v2', '/v2/test-v2/ping',
      '/v2/test2/test2-1/test2-1-1/test2-1-1-1', '/v2/test2/test2-1/test2-1-1/test2-1-1-1/ping',
      '/v2/test2/test2-1/test2-1-1/test2-2-2', '/v2/test2/test2-1/test2-1-1/test2-2-2/ping',
      '/v2/test2/test2-1/test2-1-2', '/v2/test2/test2-1/test2-1-2/ping',
      '/v2/test2/test2-1/test2-1-3', '/v2/test2/test2-1/test2-1-3/ping',
      '/v2/test2/test2-2/test2-2-2', '/v2/test2/test2-2/test2-2-2/ping',
      '/v2/test2/test2-3/', '/v2/test2/test2-3/ping',
      '/v3', '/v3/ping'
    ]
    let cnt = 0

    async.eachSeries(
      testRoutes,
      function (r, cb) {
        request(appExpress)
          .get(r)
          .expect(200)
          .end((err, res) => {
            if (err) {
              console.error(`error ${res.status} ` + 'error route: ' + r)
              return cb(err)
            }
            cnt += 1
            cb()
          })
      },
      function (err) {
        if (err) return done(err)
        expect(cnt).to.equal(testRoutes.length)
        // console.log('done!');
        done()
      })
  })

  describe('Route `x` and `env`', function () {
    beforeEach(function (done) {
      appExpress = express()
      router = require('../index')
      process.env.NODE_ENV = undefined
      done()
    })

    afterEach(function (done) {
      appExpress = undefined
      router = undefined
      done()
    })

    it('should fail access when route is disable', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes'
      router(appExpress, rootDir, routesDir)

      async.parallel([
        function (cb) {
          request(appExpress)
            .get('/disable')
            .expect(404)
            .end(cb)
        }
      ], (err) => {
        if (err) return done(err)
        done()
      })
    })

    it('should fail when env mismatch', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes'
      router(appExpress, rootDir, routesDir)

      async.parallel([
        function (cb) {
          request(appExpress)
            .get('/ping-prod')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-dev')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-no-env')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-prod-dev')
            .expect(404)
            .end(cb)
        }
      ], (err) => {
        if (err) return done(err)
        done()
      })
    })

    it('should success when env prod match', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes'
      process.env.NODE_ENV = 'production'
      router(appExpress, rootDir, routesDir)

      async.parallel([
        function (cb) {
          request(appExpress)
            .get('/ping-prod')
            .expect(200)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-dev')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-no-env')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-prod-dev')
            .expect(200)
            .end(cb)
        }
      ], (err) => {
        if (err) return done(err)
        done()
      })
    })

    it('should success when env dev match', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes'
      process.env.NODE_ENV = 'develop'
      router(appExpress, rootDir, routesDir)

      async.parallel([
        function (cb) {
          request(appExpress)
            .get('/ping-prod')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-dev')
            .expect(200)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-no-env')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-prod-dev')
            .expect(200)
            .end(cb)
        }
      ], (err) => {
        if (err) return done(err)
        done()
      })
    })

    it('should success when env dev match', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes'
      router(appExpress, rootDir, routesDir)

      process.env.NODE_ENV = 'staging'

      async.parallel([
        function (cb) {
          request(appExpress)
            .get('/ping-prod')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-dev')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-no-env')
            .expect(404)
            .end(cb)
        },
        (cb) => {
          request(appExpress)
            .get('/ping-prod-dev')
            .expect(404)
            .end(cb)
        }
      ], (err) => {
        if (err) return done(err)
        done()
      })
    })
  })

  describe('Middlewares', () => {
    beforeEach(function (done) {
      appExpress = express()
      router = require('../index')
      process.env.NODE_ENV = undefined
      done()
    })

    afterEach(function (done) {
      appExpress = undefined
      router = undefined
      done()
    })

    it('should success with some-middleware', (done) => {
      const rootDir = __dirname
      const routesDir = 'routes2'
      const middlewarerDir = 'middlewares'
      router(appExpress, rootDir, routesDir, middlewarerDir)

      request(appExpress)
      .get('/some-middleware')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.headers).to.have.property('x-some-middleware')
        expect(res.headers['x-some-middleware']).to.equal('some-middleware')
        done()
      })
    })
  })

  describe('Module', function () {
    describe('add route', function () {
      it('should error with empty route handler', function () {
        let _route = {
          method: 'POST',
          path: '/test'
        }
        expect(router._addRoute.bind({}, _route)).to.throw(Error, /route handler required/)
      })

      it('should error with route handler is not a function', function () {
        let _route = {
          method: 'POST',
          path: '/test',
          handler: 1
        }
        expect(router._addRoute.bind({}, _route)).to.throw(Error, /route handler required/)
      })
    })
  })

  xdescribe('Unit', function () {
    it('should error when route not found', (done) => {
      expect(router).to.throw(Error, /route directory not found/)
      done()
    })

    it('should not error when route found', (done) => {
      const opts = {
        baseDir: path.join(__dirname, '/'),
        targetDir: 'routes'
      }
      console.log(opts.baseDir)
      console.log(opts.targetDir)

      expect(router.bind(null, {}, opts)).to.not.throw()
      done()
    })

    xit('mount should been called', function () {
      const opts = {
        baseDir: path.join(__dirname, '/'),
        targetDir: 'routes'
      }
      console.log(opts.baseDir)
      console.log(opts.targetDir)

      expect(router.bind(null, {}, opts)).to.not.throw()
    })
  })
})
