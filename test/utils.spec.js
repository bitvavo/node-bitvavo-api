const { isObject, sleep, createPostfix } = require('../lib/utils')

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
