### cc-router
> Configurable router in express.js (hapi.js route style)

**How to install**
```
npm install --save cc-router
```

**How to use**
> [index.js](example/index.js)
```js
const express = require('express')   // express app 
const router = require('cc-router')

const app = express()
const rootDir = __dirname
const routesDir = 'routes'
router(app, rootDir, routesDir)

// or with middlewares
const middlewarerDir = 'middlewares'  // optional
router(app, rootDir, routesDir, middlewarerDir)
```

Project structure example
```
base
 |- middlewares
 |   |- auth-middleware.js
 |- routes
 |   |- index.js
 |   |- v1
 |      |- user.js
 |- index.js
```

### Route config
**Required**
- `method`: Http request method ex. GET, POST, PUT, DELETE
- `path`: Path to this endpoint
- `handler`: Function for this route endpoint

**Optional**
- `configs`: Add middlewares to this route
- `x`: fast disable route
- `env`: enabled route when NODE_ENV is matched

#### Example route file
> [routes/index.js](example/routes/index.js)
```js
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (req, res) => (res.json({msg: 'hello from v1.0'}))
  },
  {
    method: 'POST',
    path: '/hello',
    handler: (req, res) => {
      res.json({msg: 'world'});
    }
  },
  {
    method: 'GET',
    path: '/disable',
    x: true,
    handler: (req, res) => res.send('pong')
  },
  {
    method: 'GET',
    path: '/ping',
    env: ['production', 'develop'], // allow when NODE_ENV is `production` or `develop`
    handler: (req, res) => res.send('pong')
  },
  // middleware example
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
```

### Example middleware
> [routes/index.js](example/routes/index.js)
```js
const Joi = require('joi')

module.exports = [
  {
    method: 'post',
    path: '/test-validate',
    configs: {                  // middleware configs
      validate: {               // `validate` middleware
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
```
> [middlewares/input-validate.js](example/middlewares/input-validate.js)
```js
const validator = require('express-validation')

module.exports.keyName = 'validate'

module.exports.init = (router, {path, method, configs}) => {
  const keyName = module.exports.keyName
  // check configs match with `validate`
  if (configs && keyName in configs && typeof configs[keyName] === 'object') {
    router[method](path, validator(configs[keyName]))
    return true
  }
}
```

#### Try an example
```sh
# clone project
git clone https://github.com/ChomCHOB/cc-router.git && cd cc-router

# install dependencies
npm install

# run an example
npm run example

## try to request 
# simple get
curl -X GET http://127.0.0.1:3000/hello
# {
#   "msg": "hello world"
# }

# error POST (no id)
curl -X POST http://127.0.0.1:3000/test-validate
# {                              
#   "status": 400,               
#   "statusText": "Bad Request", 
#   "errors": [                  
#     {                          
#       "field": [               
#         "id"                   
#       ],                       
#       "location": "body",      
#       "messages": [            
#         "\"id\" is required"   
#       ],                       
#       "types": [               
#         "any.required"         
#       ]                        
#     }                          
#   ]                            
# }                              

# success POST with id
curl -X POST http://127.0.0.1:3000/test-validate \
  -H 'content-type: application/json' \
  -d '{"id": "1234"}'
# {
#   "msg": "success",
#   "id": "1234"
# }
```
