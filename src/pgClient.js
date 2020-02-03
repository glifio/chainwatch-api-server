const { Client } = require('pg')
const connectionString = process.env.LOTUS_DB
let client

require('dotenv').config()

const startPGClient = async () => {
  try {
    client = await new Client(connectionString)
    console.log('Connected to database')
  } catch (error) {
    throw error
  }
}

module.exports = {
  startPGClient,
  client
}
