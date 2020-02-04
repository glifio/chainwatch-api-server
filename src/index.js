const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT || 8080
const { pg } = require('./pgClient')

const app = express()
module.exports = app

const createApp = () => {
  app.use(morgan('dev'))
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api/v0', require('./routes'))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )
}

const connectDB = async () => {
  pg.initClient()
  await pg.connect()
  console.log('Connected to the db')
}

async function bootApp() {
  await connectDB()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
