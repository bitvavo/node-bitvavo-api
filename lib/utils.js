const crypto = require('crypto')

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
 * @param {unknown} [body]
 * @returns {Promise<string>}
 */
exports.createSignature = async function createSignature(secret, timestamp, method, url, body = {}) {
  let string = timestamp + method + '/v2' + url
  if (Object.keys(body).length !== 0) {
    string += JSON.stringify(body)
  }
  return crypto.createHmac('sha256', secret).update(string).digest('hex')
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
