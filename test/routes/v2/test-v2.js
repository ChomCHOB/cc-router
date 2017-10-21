module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (req, res) {
      res.json({msg: 'hello from test-v2'})
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
    method: 'put',
    path: '/user/:user_id',
    handler: (req, res) => {
      res.send('user: ' + req.params.user_id)
    }
  }
]
