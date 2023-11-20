/**
 * @param {number} millis
 * @returns {Promise<void>}
 */
exports.sleep = function sleep(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis)
  })
}
