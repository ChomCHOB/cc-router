'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (req, res) {
      res.json({ msg: 'hello from v1' })
    }
  },
  {
    method: 'GET',
    path: '/back',
    handler: function (req, res) {
      res.send('pong')
    }
  },
  {
    method: 'POST',
    path: '/ping2',
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/disable',
    x: 1,
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/ping-prod',
    env: 'production',
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/ping-dev',
    env: 'develop',
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/ping-no-env',
    env: [],
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/ping-prod-dev',
    env: ['production', 'develop'],
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'get',
    path: '/some-middleware',
    configs: {
      'some-middleware': true
    },
    handler: (req, res) => res.send('pong')
  }
]
