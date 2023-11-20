const { sleep } = require('../lib/utils')

describe('utils', () => {
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
