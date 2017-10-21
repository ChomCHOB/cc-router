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
    path: '/ping',
    handler: function (req, res) {
      res.send('pong')
    }
  },
  {
    method: 'POST',
    path: '/ping2',
    handler: function (req, res) {
      res.send('pong2')
    }
  }
]
