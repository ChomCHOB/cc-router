module.exports = [
  {
    method: 'get',
    path: '/some-middleware',
    configs: {
      'some-middleware': true
    },
    handler: (req, res) => res.send('pong')
  }
]
