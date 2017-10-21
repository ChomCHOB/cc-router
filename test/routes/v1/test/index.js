module.exports = function () {
  return [
    {
      method: 'GET',
      path: '/',
      handler: function (req, res) {
        res.json({msg: 'hello from v1/test'})
      }
    },
    {
      method: 'GET',
      path: '/ping',
      handler: function (req, res) {
        res.json({msg: 'pong'})
      }
    }
  ]
}
