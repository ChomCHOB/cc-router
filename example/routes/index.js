const Joi = require('joi')

module.exports = [
  {
    method: 'get',
    path: '/hello',
    handler: (req, res) => {
      res.json({ msg: 'hello world' })
    }
  },
  {
    method: 'post',
    path: '/test-validate',
    configs: {
      validate: {
        body: {
          id: Joi.string().required()
        }
      }
    },
    handler: (req, res) => {
      res.json({
        msg: 'success',
        id: req.body.id
      })
    }
  }
]
