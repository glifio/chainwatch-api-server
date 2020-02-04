const { Client } = require('pg')
require('dotenv').config()

const connectionString = process.env.LOTUS_DB
const client = new Client(connectionString)

const startPGClient = async () => {
  try {
    await client.connect()
    console.log('Connected to database')
  } catch (error) {
    throw error
  }
}

module.exports = {
  startPGClient,
  client
}
