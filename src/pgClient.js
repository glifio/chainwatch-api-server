const { Client } = require('pg')
require('dotenv').config()

class PGClient {
  constructor(connectionString) {
    this.client = null
    this.connectionString = connectionString
    this.connected = false
  }

  initClient = () => (this.client = new Client(this.connectionString))

  getClient = () => this.client

  connect = async () => {
    try {
      await this.client.connect()
      this.connected = true
    } catch (err) {
      throw new Error(err)
    }
  }
}

const pg = new PGClient(process.env.LOTUS_DB)

module.exports = {
  pg
}
