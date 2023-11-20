const { isObject, sleep, createPostfix, createSignature } = require('../lib/utils')

describe('utils', () => {
  describe('createPostfix', () => {
    it('should encode an empty object as an empty string', () => {
      expect(createPostfix({})).toBe('')
    })

    it('should encode parameters as a query string', () => {
      expect(createPostfix({ first: 42, second: 'str', third: false })).toBe('?first=42&second=str&third=false')
    })

    it('should encode special characters', () => {
      expect(createPostfix({ special: '%+& /' })).toBe('?special=%25%2B%26%20%2F')
    })
  })

  describe('createSignature', () => {
    const SECRET = 'bitvavo'

    it('should encode a GET request', async () => {
      await expect(createSignature(SECRET, 1548175200641, 'GET', '/websocket')).resolves.toBe(
        '653fc0505431c63a043273da4bd2f0927eae83948d796084f313e5d1131b0d6f',
      )
    })

    it('should encode a POST request', async () => {
      const body = JSON.stringify({
        market: 'BTC-EUR',
        side: 'buy',
        price: '5000',
        amount: '1.23',
        orderType: 'limit',
      })
      await expect(createSignature(SECRET, 1548172481125, 'POST', '/order', body)).resolves.toBe(
        '44d022723a20973a18f7ee97398b9fdd405d2d019c8d39e24b8cc0dcb39ca016',
      )
    })
  })

  describe('isObject', () => {
    it('should return true for an object', () => {
      expect(isObject({})).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject([])).toBe(true)
    })

    it('should return false for anything else', () => {
      expect(isObject('str')).toBe(false)
      expect(isObject(42)).toBe(false)
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(() => {})).toBe(false)
    })
  })

  describe('sleep', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    it('should resolve after a given time', async () => {
      let fulfilled = false

      const p = sleep(1_000).then(() => {
        fulfilled = true
      })

      expect(fulfilled).toBe(false)
      jest.advanceTimersByTime(500)
      expect(fulfilled).toBe(false)
      jest.advanceTimersByTime(500)
      await p
      expect(fulfilled).toBe(true)
    })
  })
})
