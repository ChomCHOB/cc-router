const express = require('express')
const bodyParser = require('body-parser')
const ev = require('express-validation')
const router = require('../index')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

router(app, __dirname, 'routes', 'middlewares')

// error handler
app.use((err, req, res, next) => {
  // specific for validation errors
  if (err instanceof ev.ValidationError) return res.status(err.status).json(err)

  // other type of errors, it *might* also be a Runtime Error
  // example handling
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).send(err.stack)
  } else {
    return res.status(500)
  }
})

if (require.main === module) {
  app.listen(3000)
  console.log('Start listening at port 3000')
}

module.exports = app
