const validFilAddress = address => {
  if (typeof address !== 'string') return false
  if (address[0] !== 'f' && address[0] !== 't') return false
  if (typeof Number(address[1]) !== 'number') return false
  return true
}

module.exports = {
  validFilAddress
}
