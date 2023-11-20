/**
 * @param {unknown} parameter
 * @returns {boolean}
 */
exports.isObject = function isObject(parameter) {
  return typeof parameter === 'object' && parameter !== null
}

/**
 * @param {number} millis
 * @returns {Promise<void>}
 */
exports.sleep = function sleep(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis)
  })
}
