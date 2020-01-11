const router = require('express').Router()
module.exports = router

const { client } = require('../pgClient')
const { validFilAddress } = require('../utils')

router.get('/messages/:address', async (req, res, next) => {
  const { address } = req.params
  if (!validFilAddress(address)) {
    return res.json({
      status: 'fail',
      data: { address: 'Invalid Filecoin address' }
    })
  }

  const page = req.query.page || 0
  const limit = req.query.limit || 10

  const offset = page * limit

  const { rows } = await client.query(
    `
        SELECT *
        FROM messages
        WHERE "to" = $1
        OR "from" = $1
        ORDER BY nonce DESC
        LIMIT $2
        OFFSET $3
     `,
    [address, limit, offset]
  )

  res.json({ status: 'success', data: rows })
})
