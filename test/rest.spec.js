const Bitvavo = require('../lib/index')
const nock = require('nock')
const { createSignature } = require('../lib/utils')

describe('rest', () => {
  let bitvavo, scope

  beforeEach(() => {
    bitvavo = Bitvavo()
    scope = nock('https://api.bitvavo.com')
  })

  afterEach(() => {
    expect(scope.isDone()).toBe(true)
  })

  describe('unauthorized', () => {
    it('getTime', async () => {
      scope.get('/v2/time').reply(200, { time: 1700000000000 })

      const res = await bitvavo.time()
      expect(res).toEqual({ time: 1700000000000 })
    })
  })

  describe('authorized', () => {
    const KEY = 'mykey'
    const SECRET = 'mysecret'

    beforeEach(() => {
      bitvavo.options({ apiKey: 'mykey', apiSecret: 'mysecret' })
    })

    it('getTime', async () => {
      scope.get('/v2/time').reply(200, function () {
        verifyHeaders(this.req)
        return { time: 1700000000000 }
      })

      const res = await bitvavo.time()
      expect(res).toEqual({ time: 1700000000000 })
    })

    function verifyHeaders(req) {
      const timestamp = req.headers['bitvavo-access-timestamp']
      const signature = createSignature(SECRET, timestamp, 'GET', '/time')
      expect(req.headers['bitvavo-access-key']).toBe(KEY)
      expect(req.headers['bitvavo-access-signature']).toBe(signature)
    }
  })
})
