const nock = require('nock')
const { Headers } = require('cross-fetch')
const Bitvavo = require('../lib/index')
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
      scope.get('/v2/time').reply(200, async function () {
        await verifyHeaders(this.req)
        return { time: 1700000000000 }
      })

      const res = await bitvavo.time()
      expect(res).toEqual({ time: 1700000000000 })
    })

    async function verifyHeaders(req) {
      const headers = new Headers(req.headers)
      const timestamp = Number(headers.get('bitvavo-access-timestamp'))
      const signature = await createSignature(SECRET, timestamp, 'GET', '/time')
      expect(headers.get('bitvavo-access-key')).toBe(KEY)
      expect(headers.get('bitvavo-access-signature')).toBe(signature)
    }
  })
})
