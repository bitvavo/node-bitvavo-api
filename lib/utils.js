const { Sha256 } = require('@aws-crypto/sha256-js')

/**
 * @param {{ [key: string]: string | number | boolean }} options
 * @returns {string}
 */
exports.createPostfix = function createPostfix(options) {
  let params = Object.keys(options)
    .reduce((a, k) => {
      if (options[k].length !== 0) {
        a.push(k + '=' + encodeURIComponent(options[k]))
      }
      return a
    }, [])
    .join('&')
  if (Object.keys(options).length > 0) {
    params = '?' + params
  }
  return params
}

/**
 * @param {string} secret
 * @param {number} timestamp
 * @param {string} method
 * @param {string} url
 * @param {string} [body]
 * @returns {Promise<string>}
 */
exports.createSignature = async function createSignature(secret, timestamp, method, url, body = '') {
  const string = timestamp + method + '/v2' + url + body
  return hmacSha256(secret, string)
}

/**
 * @param {string} secret
 * @param {string} data
 * @returns {Promise<string>}
 */
async function hmacSha256(secret, data) {
  const hash = new Sha256(secret)
  hash.update(data)
  const result = await hash.digest()
  return toHexString(result)
}

/**
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function toHexString(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

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
