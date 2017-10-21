const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
let appExpress

describe('example app', function () {
  beforeEach(function (done) {
    appExpress = require('../examples/index')
    done()
  })

  afterEach(function (done) {
    appExpress = undefined
    done()
  })

  it('should success simple get', (done) => {
    request(appExpress)
    .get('/hello')
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.body).to.have.property('msg')
      expect(res.body.msg).to.equal('hello world')
      done()
    })
  })

  it('should error when post without id', (done) => {
    request(appExpress)
    .post('/test-validate')
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.body.errors.length).to.equal(1)
      done()
    })
  })

  it('should error when post without id', (done) => {
    const id = '1234'
    request(appExpress)
    .post('/test-validate')
    // .set('Content-Type', 'application/json')
    // .send(`{"id":"${id}"}`)
    .send({ id: id })
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      expect(res.body).to.have.property('msg')
      expect(res.body).to.have.property('id')
      expect(res.body.msg).to.equal('success')
      expect(res.body.id).to.equal(id)
      done()
    })
  })
})
