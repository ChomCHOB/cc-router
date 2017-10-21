module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (req, res) {
      res.json({msg: 'hello from v2'})
    }
  },
  {
    method: 'GET',
    path: '/ping',
    handler: function (req, res) {
      res.send('pong')
    }
  }
]
