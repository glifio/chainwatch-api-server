const { Client } = require('pg')

require('dotenv').config()

const connectionString = process.env.LOTUS_DB

const client = new Client({ connectionString })

module.exports = {
  client
}
