const router = require('express').Router()
module.exports = router

const { client } = require('../pgClient')
const { validFilAddress } = require('../utils')

const getMessageCountByAddress = async address => {
  const { rows } = await client.query(
    `
      SELECT COUNT(*)
      FROM messages
      INNER JOIN receipts on messages .cid = receipts.msg
      WHERE "to" = $1
      OR "from" = $1
    `,
    [address]
  )

  return Number(rows[0].count)
}

router.get('/messages/:address', async (req, res, next) => {
  const { address } = req.params
  if (!validFilAddress(address)) {
    return res.json({
      status: 'fail',
      data: { address: 'Invalid Filecoin address' }
    })
  }

  const page = Number(req.query.page) || 0
  const limit = Number(req.query.limit) || 10

  const offset = page * limit

  const [count, data] = await Promise.all([
    getMessageCountByAddress(address),
    client.query(
      `
        SELECT
          messages.cid,
          messages."from",
          messages."to",
          messages.nonce,
          messages.value,
          messages.gasprice,
          messages.gaslimit,
          messages.method,
          messages.params,
          receipts.state,
          receipts.idx,
          receipts.exit,
          receipts.gas_used,
          receipts.return
        FROM messages 
        INNER JOIN receipts on messages .cid = receipts.msg
        WHERE "to" = $1
        OR "from" = $1
        ORDER BY nonce DESC
        LIMIT $2
        OFFSET $3
      `,
      [address, limit, offset]
    )
  ])

  const onFirstPage = page === 0
  const onLastPage = offset + limit > count

  res.json({
    status: 'success',
    data: data.rows,
    links: {
      prev: onFirstPage
        ? null
        : `/messages/${address}?page=${page - 1}&limit=${limit}`,
      self: `/messages/${address}?page=${page}&limit=${limit}`,
      next: onLastPage
        ? null
        : `/messages/${address}?page=${page + 1}&limit=${limit}`
    }
  })
})
