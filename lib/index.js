const EventEmitter = require('events')
const { fetch, Headers } = require('cross-fetch')
const { createPostfix, createSignature, isObject, sleep } = require('./utils')

const WebSocket =
  typeof window !== 'undefined' && typeof window.WebSocket !== 'undefined' ? window.WebSocket : require('ws')

let api = function Bitvavo() {
  let base = 'https://api.bitvavo.com/v2'
  let socketBase = 'wss://ws.bitvavo.com/v2/'

  const emitter = new EventEmitter()

  let apiKey = ''
  let apiSecret = ''
  let accessWindow = 10000

  let rateLimitRemaining = 1000
  let rateLimitReset = 0

  let debugging = false
  let startedSocket = false
  let socketDidNotConnect = false
  let emitterReturned = false

  let subscriptionTickerCallback,
    subscriptionTicker24hCallback,
    subscriptionAccountCallback,
    subscriptionCandlesCallback,
    subscriptionBookUpdatesCallback,
    subscriptionTradesCallback,
    subscriptionBookCallback
  let localBook, keepLocalBookCopy

  const debugToConsole = function (message, object = null) {
    if (debugging) {
      if (object !== null) {
        console.log(new Date().toLocaleTimeString() + ' DEBUG: ' + message, object)
      } else {
        console.log(new Date().toLocaleTimeString() + ' DEBUG: ' + message)
      }
    }
  }

  const errorToConsole = function (message, object = null) {
    if (object !== null) {
      console.log(new Date().toLocaleTimeString() + ' ERROR: ' + message, object)
    } else {
      console.log(new Date().toLocaleTimeString() + ' ERROR: ' + message)
    }
  }

  const waitForSocketPrivate = function (socket, callback) {
    setTimeout(() => {
      if (socket.authenticated) {
        callback()
      } else {
        waitForSocketPrivate(socket, callback)
      }
    }, 5)
  }

  const doSendPublic = function (ws, message) {
    debugToConsole('SENT: ' + message)
    ws.send(message)
  }

  const doSendPrivate = function (message) {
    if (apiKey === '') {
      errorToConsole('You did not set the API key, but requested a private function.')
      return
    }
    if (this.authenticated) {
      debugToConsole('SENT: ' + message)
      this.websocket.send(message)
    } else {
      waitForSocketPrivate(this, () => {
        debugToConsole('SENT: ' + message)
        this.websocket.send(message)
      })
    }
  }

  const asksCompare = function (a, b) {
    if (parseFloat(a) < parseFloat(b)) return true
    return false
  }

  const bidsCompare = function (a, b) {
    if (parseFloat(a) > parseFloat(b)) return true
    return false
  }

  const sortAndInsert = function (update, book, compareFunc) {
    for (let updateEntry of update) {
      let entrySet = false
      for (let j in book) {
        let bookItem = book[j]
        if (compareFunc(updateEntry[0], bookItem[0])) {
          book.splice(j, 0, updateEntry)
          entrySet = true
          break
        }
        if (parseFloat(bookItem[0]) === parseFloat(updateEntry[0])) {
          if (parseFloat(updateEntry[1]) > 0) {
            book[j] = updateEntry
            entrySet = true
            break
          } else {
            entrySet = true
            book.splice(j, 1)
            break
          }
        }
      }
      if (entrySet === false) {
        book.push(updateEntry)
      }
    }
    return book
  }

  const checkLimit = function () {
    if (rateLimitReset <= Date.now()) {
      rateLimitRemaining = 1000
    }
  }

  const updateRateLimit = function (response) {
    let timeToWait
    if (response.errorCode === 105) {
      rateLimitRemaining = 0
      rateLimitReset = parseInt(response.error.split(' at ')[1].split('.')[0])
      timeToWait = rateLimitReset - Date.now()
      setTimeout(checkLimit, timeToWait)
    }
    if ('bitvavo-ratelimit-remaining' in response) {
      rateLimitRemaining = response['bitvavo-ratelimit-remaining']
    }
    if ('bitvavo-ratelimit-resetat' in response) {
      rateLimitReset = response['bitvavo-ratelimit-resetat']
      timeToWait = rateLimitReset - Date.now()
      setTimeout(checkLimit, timeToWait)
    }
  }

  const handleSocketResponse = function (response) {
    this.reconnectTimer = 100
    debugToConsole('RECEIVED: ', response)
    if ('error' in response) {
      updateRateLimit(response)
      try {
        emitter.emit('error', response)
      } catch (error) {
        errorToConsole(
          "We are trying to emit an error. But you forgot to set the emitter's on error, consult getting started with websockets in the readme.",
        )
      }
    } else if ('authenticated' in response) {
      this.authenticated = true
    } else if ('action' in response) {
      if (emitterReturned === false && typeof keepLocalBookCopy === 'undefined') {
        errorToConsole(
          'We have received a response, but you did not request the emitter in the right manner, please consult getting started with websockets in the readme.',
        )
        return
      }
      switch (response.action) {
        case 'getTime':
          emitter.emit('time', response.response)
          break
        case 'getMarkets':
          emitter.emit('markets', response.response)
          break
        case 'getAssets':
          emitter.emit('assets', response.response)
          break
        case 'getBook':
          emitter.emit('book', response.response)
          if (typeof keepLocalBookCopy !== 'undefined') {
            if (keepLocalBookCopy[response.response.market]) {
              let bookEntry = response.response
              let market = bookEntry.market
              localBook[market] = {}
              localBook[market].bids = bookEntry.bids
              localBook[market].asks = bookEntry.asks
              localBook[market].nonce = bookEntry.nonce
              subscriptionBookCallback[market](localBook[market])
            }
          }
          break
        case 'getTrades':
          emitter.emit('publicTrades', response.response)
          break
        case 'getCandles':
          emitter.emit('candles', response.response)
          break
        case 'getTicker24h':
          emitter.emit('ticker24h', response.response)
          break
        case 'getTickerPrice':
          emitter.emit('tickerPrice', response.response)
          break
        case 'getTickerBook':
          emitter.emit('tickerBook', response.response)
          break
        case 'privateCreateOrder':
          emitter.emit('placeOrder', response.response)
          break
        case 'privateUpdateOrder':
          emitter.emit('updateOrder', response.response)
          break
        case 'privateGetOrder':
          emitter.emit('getOrder', response.response)
          break
        case 'privateCancelOrder':
          emitter.emit('cancelOrder', response.response)
          break
        case 'privateCancelOrders':
          emitter.emit('cancelOrders', response.response)
          break
        case 'privateGetOrders':
          emitter.emit('getOrders', response.response)
          break
        case 'privateGetOrdersOpen':
          emitter.emit('ordersOpen', response.response)
          break
        case 'privateGetTrades':
          emitter.emit('trades', response.response)
          break
        case 'privateGetAccount':
          emitter.emit('account', response.response)
          break
        case 'privateGetFees':
          emitter.emit('fees', response.response)
          break
        case 'privateGetBalance':
          emitter.emit('balance', response.response)
          break
        case 'privateDepositAssets':
          emitter.emit('depositAssets', response.response)
          break
        case 'privateWithdrawAssets':
          emitter.emit('withdrawAssets', response.response)
          break
        case 'privateGetDepositHistory':
          emitter.emit('depositHistory', response.response)
          break
        case 'privateGetWithdrawalHistory':
          emitter.emit('withdrawalHistory', response.response)
          break
      }
    } else if ('event' in response) {
      switch (response.event) {
        case 'trade':
          if (typeof subscriptionTradesCallback !== 'undefined') {
            if (typeof subscriptionTradesCallback[response.market] !== 'undefined') {
              subscriptionTradesCallback[response.market](response)
            }
          }
          break
        case 'fill':
          if (typeof subscriptionAccountCallback !== 'undefined') {
            if (typeof subscriptionAccountCallback[response.market] !== 'undefined') {
              subscriptionAccountCallback[response.market](response)
            }
          }
          break
        case 'order':
          if (typeof subscriptionAccountCallback !== 'undefined') {
            if (typeof subscriptionAccountCallback[response.market] !== 'undefined') {
              subscriptionAccountCallback[response.market](response)
            }
          }
          break
        case 'ticker':
          subscriptionTickerCallback[response.market](response)
          break
        case 'ticker24h':
          for (let entry of response.data) {
            subscriptionTicker24hCallback[entry.market](entry)
          }
          break
        case 'book':
          if (typeof subscriptionBookUpdatesCallback !== 'undefined') {
            if (typeof subscriptionBookUpdatesCallback[response.market] !== 'undefined') {
              subscriptionBookUpdatesCallback[response.market](response)
            }
          }
          if (typeof keepLocalBookCopy !== 'undefined') {
            if (keepLocalBookCopy[response.market]) {
              if (typeof localBook[response.market] !== 'undefined') {
                let market = response.market
                if (response.nonce !== localBook[market].nonce + 1) {
                  this.websocketObject.subscriptionBook(market, subscriptionBookCallback[market])
                  break
                }
                localBook[market].bids = sortAndInsert(response.bids, localBook[market].bids, bidsCompare)
                localBook[market].asks = sortAndInsert(response.asks, localBook[market].asks, asksCompare)
                localBook[market].nonce = response.nonce
                subscriptionBookCallback[market](localBook[market])
              }
            }
          }
          break
        case 'candle':
          subscriptionCandlesCallback[response.market][response.interval](response)
          break
      }
    }
  }

  const reconnect = async function (ws) {
    delete ws.websocket
    if (typeof subscriptionTickerCallback !== 'undefined') {
      for (let market in subscriptionTickerCallback) {
        ws.subscriptionTicker(market, subscriptionTickerCallback[market])
      }
    }
    if (typeof subscriptionTicker24hCallback !== 'undefined') {
      for (let market in subscriptionTicker24hCallback) {
        ws.subscriptionTicker(market, subscriptionTicker24hCallback[market])
      }
    }
    if (typeof subscriptionAccountCallback !== 'undefined') {
      for (let market in subscriptionAccountCallback) {
        ws.subscriptionAccount(market, subscriptionAccountCallback[market])
      }
    }
    if (typeof subscriptionCandlesCallback !== 'undefined') {
      for (let market in subscriptionCandlesCallback) {
        for (let interval in subscriptionCandlesCallback[market]) {
          ws.subscriptionCandles(market, interval, subscriptionCandlesCallback[market][interval])
        }
      }
    }
    if (typeof subscriptionTradesCallback !== 'undefined') {
      for (let market in subscriptionTradesCallback) {
        ws.subscriptionTrades(market, subscriptionTradesCallback[market])
      }
    }
    if (typeof subscriptionBookUpdatesCallback !== 'undefined') {
      for (let market in subscriptionBookUpdatesCallback) {
        ws.subscriptionBookUpdates(market, subscriptionBookUpdatesCallback[market])
      }
    }
    if (typeof subscriptionBookCallback !== 'undefined') {
      for (let market in subscriptionBookCallback) {
        ws.subscriptionBook(market, subscriptionBookCallback[market])
      }
    }
  }

  const subscribe = async function (websocketObject) {
    if (typeof websocketObject.reconnectTimer === 'undefined') websocketObject.reconnectTimer = 100
    websocketObject.authenticated = false
    let ws = new WebSocket(socketBase)
    websocketObject.websocket = ws
    websocketObject.websocketObject = websocketObject
    websocketObject.websocketObject.reconnect = true
    let timestamp = Date.now()
    ws.onopen = async () => {
      debugToConsole('Connected to websocket.')
      socketDidNotConnect = false
      if (apiKey !== '') {
        doSendPublic(
          ws,
          JSON.stringify({
            'action': 'authenticate',
            'key': apiKey,
            'signature': await createSignature(apiSecret, timestamp, 'GET', '/websocket'),
            'timestamp': timestamp,
            'window': accessWindow,
          }),
        )
      }
    }
    ws.onmessage = (msg) => {
      handleSocketResponse.call(websocketObject, JSON.parse(msg.data))
    }
    ws.onerror = (msg) => {
      debugToConsole('we caught error:', msg.error)
      socketDidNotConnect = true
    }
    ws.onclose = () => {
      startedSocket = false
      if (websocketObject.websocketObject.reconnect) {
        debugToConsole(
          'Websocket was closed, we are waiting for ' + websocketObject.reconnectTimer + ' milliseconds to reconnect.',
        )
        setTimeout(reconnect, websocketObject.reconnectTimer, websocketObject)
        websocketObject.reconnectTimer = websocketObject.reconnectTimer * 2
      }
    }
    while (ws.readyState !== 1 && socketDidNotConnect === false) {
      await sleep(100)
    }
    return ws
  }

  async function request(callback, method, path, query = {}, payload = {}) {
    const promise = promiseRequest(method, path, query, payload)

    if (typeof callback === 'function') {
      return promise.then(
        (res) => callback(null, res),
        (err) => callback(err),
      )
    }

    return promise
  }

  /**
   * @param {Headers} headers
   * @param {string} method
   * @param {string} url
   * @param {string} body
   */
  async function attachAuthentication(headers, method, url, body) {
    if (apiKey !== '') {
      const timestamp = Date.now()
      const sig = await createSignature(apiSecret, timestamp, method, url.replace(base, ''), body)
      headers.set('bitvavo-access-key', apiKey)
      headers.set('bitvavo-access-signature', sig)
      headers.set('bitvavo-access-timestamp', timestamp)
      headers.set('bitvavo-access-window', accessWindow)
    }
  }

  async function promiseRequest(method, path, query = {}, payload = {}) {
    const url = base + path + createPostfix(query)
    const headers = new Headers({ 'Accept': 'application/json' })
    const options = { method, headers }

    const body = encodeBody(payload)
    attachBody(headers, options, body)
    await attachAuthentication(headers, method, url, body)

    debugToConsole('REQUEST:', options)

    let response, json
    try {
      response = await fetch(url, options)
      json = await response.json()
    } catch (error) {
      updateRateLimit(error)
      throw error
    }

    updateRateLimit(response.headers)

    if (json.error !== undefined) {
      throw json.error
    }

    return json
  }

  function encodeBody(payload) {
    const json = JSON.stringify(payload)
    if (json !== '{}') {
      return json
    } else {
      return ''
    }
  }

  /**
   * @param {Headers} headers
   * @param {RequestInit} options
   * @param {string} body
   */
  function attachBody(headers, options, body) {
    if (body !== '') {
      headers.set('Content-Type', 'application/json')
      options.body = body
    }
  }

  return {
    getEmitter: function () {
      emitterReturned = true
      return emitter
    },

    getRemainingLimit: function () {
      return rateLimitRemaining
    },

    time: function (callback = false) {
      return request(callback, 'GET', '/time')
    },

    // options: market
    markets: function (options = {}, callback = false) {
      return request(callback, 'GET', '/markets', options)
    },

    // options: symbol
    assets: function (options = {}, callback = false) {
      return request(callback, 'GET', '/assets', options)
    },

    // options: depth
    book: function (symbol = '', options = {}, callback = false) {
      if (typeof options === 'function') callback = options
      return request(callback, 'GET', '/' + symbol + '/book', options)
    },

    // options: limit, start, end, tradeIdFrom, tradeIdTo
    publicTrades: function (symbol = '', options = {}, callback = false) {
      if (typeof options === 'function') callback = options
      return request(callback, 'GET', '/' + symbol + '/trades', options)
    },

    // options: limit, start, end
    candles: function (symbol = '', interval = '', options = {}, callback = false) {
      options.interval = interval
      if (typeof options === 'function') callback = options
      return request(callback, 'GET', '/' + symbol + '/candles', options)
    },

    // options: market
    tickerPrice: function (options = {}, callback = false) {
      if (typeof options === 'function') callback = options

      return request(callback, 'GET', '/ticker/price', options)
    },

    // options: market
    tickerBook: function (options = {}, callback = false) {
      if (typeof options === 'function') callback = options

      return request(callback, 'GET', '/ticker/book', options)
    },

    // options: market
    ticker24h: function (options = {}, callback = false) {
      if (typeof options === 'function') callback = options

      return request(callback, 'GET', '/ticker/24h', options)
    },

    // Optional body parameters: limit:(amount, price, postOnly), market:(amount, amountQuote, disableMarketProtection)
    //                           stopLoss/takeProfit:(amount, amountQuote, disableMarketProtection, triggerType, triggerReference, triggerAmount)
    //                           stopLossLimit/takeProfitLimit:(amount, price, postOnly, triggerType, triggerReference, triggerAmount)
    //                           all orderTypes: timeInForce, selfTradePrevention, responseRequired
    placeOrder: function (market = '', side = '', orderType = '', operatorId = 0, body = {}, callback = false) {
      body.market = market
      body.side = side
      body.orderType = orderType
      body.operatorId = operatorId
      return request(callback, 'POST', '/order', {}, body)
    },

    getOrder: function (market = '', options = {}, callback = false) {
      if (typeof options === 'string') {
        options = { orderId: options }
      }
      if (!isObject(options)) throw new Error('Second parameter "options" is not an object')

      const query = { market, orderId: options.orderId ?? '', clientOrderId: options.clientOrderId ?? '' }
      return request(callback, 'GET', '/order', query)
    },

    // Optional body parameters: limit:(amount, amountRemaining, price, timeInForce, selfTradePrevention, postOnly)
    //               untriggered stopLoss/takeProfit:(amount, amountQuote, disableMarketProtection, triggerType, triggerReference, triggerAmount)
    //                           stopLossLimit/takeProfitLimit: (amount, price, postOnly, triggerType, triggerReference, triggerAmount)
    updateOrder: function (market = '', orderId = '', operatorId = 0, body = {}, callback = false) {
      body.market = market
      body.orderId = orderId
      body.operatorId = operatorId
      return request(callback, 'PUT', '/order', {}, body)
    },

    cancelOrder: function (symbol = '', orderId = '', operatorId = 0, callback = false) {
      const query = { 'market': symbol, 'orderId': orderId, 'operatorId': operatorId }
      return request(callback, 'DELETE', '/order', query, {})
    },

    // options: orderIdFrom, orderIdTo, limit, start, end
    getOrders: function (symbol = '', options = {}, callback = false) {
      options.market = symbol
      if (typeof options === 'function') callback = options
      return request(callback, 'GET', '/orders', options)
    },

    // options: market
    cancelOrders: function (options = {}, operatorId = 0, callback = false) {
      options.operatorId = operatorId
      let query = options
      if (typeof options === 'function') {
        callback = options
        query = {}
      }
      return request(callback, 'DELETE', '/orders', query)
    },

    // options: market
    ordersOpen: function (options = {}, callback = false) {
      return request(callback, 'GET', '/ordersOpen', options)
    },

    // options: limit, start, end, tradeIdFrom, tradeIdTo
    trades: function (market = '', options = {}, callback = false) {
      let cb, query
      if (typeof market === 'function') {
        cb = market
        query = {}
      } else if (typeof options === 'function') {
        cb = options
        query = { market }
      } else {
        cb = callback
        query = { market, ...options }
      }
      return request(cb, 'GET', '/trades', query)
    },

    account: function (callback = false) {
      return request(callback, 'GET', '/account')
    },

    fees: function (market = '', callback = false) {
      if (typeof market === 'function') {
        callback = market
        market = ''
      }

      const query = {}
      if (market) {
        query.market = market
      }

      return request(callback, 'GET', '/account/fees', query)
    },

    // options: symbol
    balance: function (options = {}, callback = false) {
      return request(callback, 'GET', '/balance', options)
    },

    depositAssets: function (symbol = '', callback = false) {
      const query = { 'symbol': symbol }
      return request(callback, 'GET', '/deposit', query)
    },

    // Optional body parameters: paymentId, internal, addWithdrawalFee
    withdrawAssets: function (symbol = '', amount = '', address = '', body = {}, callback = false) {
      body.symbol = symbol
      body.amount = amount
      body.address = address
      return request(callback, 'POST', '/withdrawal', {}, body)
    },

    // options: symbol, limit, start, end
    depositHistory: function (options = {}, callback = false) {
      return request(callback, 'GET', '/depositHistory', options)
    },

    // options: symbol, limit, start, end
    withdrawalHistory: function (options = {}, callback = false) {
      return request(callback, 'GET', '/withdrawalHistory', options)
    },

    options: function (options) {
      for (let key in options) {
        if (key.toLowerCase() === 'apikey') {
          apiKey = options[key]
        } else if (key.toLowerCase() === 'apisecret') {
          apiSecret = options[key]
        } else if (key.toLowerCase() === 'accesswindow') {
          accessWindow = options[key]
        } else if (key.toLowerCase() === 'debugging') {
          debugging = options[key]
        } else if (key.toLowerCase() === 'resturl') {
          base = options[key]
        } else if (key.toLowerCase() === 'wsurl') {
          socketBase = options[key]
        }
      }
      this.reconnectTimer = 100
      return this
    },
    websocket: {
      checkSocket: async function () {
        if (typeof this.websocket === 'undefined' && startedSocket === false) {
          startedSocket = true
          this.websocket = await subscribe(this)
        } else if (typeof this.websocket === 'undefined') {
          while (typeof this.websocket === 'undefined') {
            await sleep(100)
          }
        }
      },

      close: async function () {
        this.reconnect = false
        this.websocket.close()
      },

      time: async function () {
        await this.checkSocket()
        doSendPublic(this.websocket, JSON.stringify({ 'action': 'getTime' }))
      },

      // options: market
      markets: async function (options = {}) {
        await this.checkSocket()
        options.action = 'getMarkets'
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: symbol
      assets: async function (options = {}) {
        await this.checkSocket()
        options.action = 'getAssets'
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: depth
      book: async function (market = '', options = {}) {
        await this.checkSocket()
        options.action = 'getBook'
        options.market = market
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: limit, start, end, tradeIdFrom, tradeIdTo
      publicTrades: async function (market = '', options = {}) {
        await this.checkSocket()
        options.action = 'getTrades'
        options.market = market
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: limit, start, end
      candles: async function (market = '', interval = '', options = {}) {
        await this.checkSocket()
        options.action = 'getCandles'
        options.market = market
        options.interval = interval
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: market
      ticker24h: async function (options = {}) {
        await this.checkSocket()
        options.action = 'getTicker24h'
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: market
      tickerPrice: async function (options = {}) {
        await this.checkSocket()
        options.action = 'getTickerPrice'
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // options: market
      tickerBook: async function (options = {}) {
        await this.checkSocket()
        options.action = 'getTickerBook'
        doSendPublic(this.websocket, JSON.stringify(options))
      },

      // Optional body parameters: limit:(amount, price, postOnly), market:(amount, amountQuote, disableMarketProtection)
      //                           stopLoss/takeProfit:(amount, amountQuote, disableMarketProtection, triggerType, triggerReference, triggerAmount)
      //                           stopLossLimit/takeProfitLimit:(amount, price, postOnly, triggerType, triggerReference, triggerAmount)
      //                           all orderTypes: timeInForce, selfTradePrevention, responseRequired
      placeOrder: async function (market = '', side = '', orderType = '', operatorId = 0, body = {}) {
        await this.checkSocket()
        body.action = 'privateCreateOrder'
        body.market = market
        body.side = side
        body.orderType = orderType
        body.operatorId = operatorId
        doSendPrivate.call(this, JSON.stringify(body))
      },

      getOrder: async function (market = '', options = {}) {
        if (typeof options === 'string') {
          options = { orderId: options }
        }
        if (!isObject(options)) throw new Error('Second parameter "options" is not an object')

        await this.checkSocket()
        const message = {
          'action': 'privateGetOrder',
          market,
          orderId: options.orderId,
          clientOrderId: options.clientOrderId,
        }
        doSendPrivate.call(this, JSON.stringify(message))
      },

      // Optional body parameters: limit:(amount, amountRemaining, price, timeInForce, selfTradePrevention, postOnly)
      //               untriggered stopLoss/takeProfit:(amount, amountQuote, disableMarketProtection, triggerType, triggerReference, triggerAmount)
      //                           stopLossLimit/takeProfitLimit: (amount, price, postOnly, triggerType, triggerReference, triggerAmount)
      updateOrder: async function (market = '', orderId = '', operatorId = 0, body = {}) {
        await this.checkSocket()
        body.action = 'privateUpdateOrder'
        body.market = market
        body.orderId = orderId
        body.operatorId = operatorId
        doSendPrivate.call(this, JSON.stringify(body))
      },

      cancelOrder: async function (market = '', orderId = '', operatorId = 0) {
        await this.checkSocket()
        let options = { 'action': 'privateCancelOrder' }
        options.market = market
        options.orderId = orderId
        options.operatorId = operatorId
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: limit, start, end, orderIdFrom, orderIdTo
      getOrders: async function (market = '', options = {}) {
        await this.checkSocket()
        options.action = 'privateGetOrders'
        options.market = market
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: market
      cancelOrders: async function (options = {}, operatorId = 0) {
        await this.checkSocket()
        options.action = 'privateCancelOrders'
        options.operatorId = operatorId
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: market
      ordersOpen: async function (options = {}) {
        await this.checkSocket()
        options.action = 'privateGetOrdersOpen'
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: limit, start, end, tradeIdFrom, tradeIdTo
      trades: async function (market = '', options = {}) {
        await this.checkSocket()
        options.action = 'privateGetTrades'
        options.market = market
        doSendPrivate.call(this, JSON.stringify(options))
      },

      account: async function () {
        await this.checkSocket()
        const options = { action: 'privateGetAccount' }
        doSendPrivate.call(this, JSON.stringify(options))
      },

      fees: async function (market = '') {
        await this.checkSocket()
        const options = { action: 'privateGetFees' }
        if (market) {
          options.market = market
        }
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: symbol
      balance: async function (options = {}) {
        await this.checkSocket()
        options.action = 'privateGetBalance'
        doSendPrivate.call(this, JSON.stringify(options))
      },

      depositAssets: async function (symbol = '') {
        await this.checkSocket()
        let options = { 'action': 'privateDepositAssets', 'symbol': symbol }
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // Optional body parameters: paymentId, internal, addWithdrawalFee
      withdrawAssets: async function (symbol = '', amount = '', address = '', body = {}) {
        await this.checkSocket()
        body.action = 'privateWithdrawAssets'
        body.symbol = symbol
        body.amount = amount
        body.address = address
        doSendPrivate.call(this, JSON.stringify(body))
      },

      // options: symbol, limit, start, end
      depositHistory: async function (options = {}) {
        await this.checkSocket()
        options.action = 'privateGetDepositHistory'
        doSendPrivate.call(this, JSON.stringify(options))
      },

      // options: symbol, limit, start, end
      withdrawalHistory: async function (options = {}) {
        await this.checkSocket()
        options.action = 'privateGetWithdrawalHistory'
        doSendPrivate.call(this, JSON.stringify(options))
      },

      subscriptionTicker: async function (market = '', callback) {
        if (typeof subscriptionTickerCallback === 'undefined') subscriptionTickerCallback = {}
        subscriptionTickerCallback[market] = callback
        await this.checkSocket()
        doSendPublic(
          this.websocket,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'ticker', 'markets': [market] }] }),
        )
      },

      subscriptionTicker24h: async function (market = '', callback) {
        if (typeof subscriptionTicker24hCallback === 'undefined') subscriptionTicker24hCallback = {}
        subscriptionTicker24hCallback[market] = callback
        await this.checkSocket()
        doSendPublic(
          this.websocket,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'ticker24h', 'markets': [market] }] }),
        )
      },

      subscriptionAccount: async function (market = '', callback) {
        if (typeof subscriptionAccountCallback === 'undefined') subscriptionAccountCallback = {}
        subscriptionAccountCallback[market] = callback
        await this.checkSocket()
        doSendPrivate.call(
          this,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'account', 'markets': [market] }] }),
        )
      },

      subscriptionCandles: async function (market = '', interval = '', callback) {
        if (typeof subscriptionCandlesCallback === 'undefined') subscriptionCandlesCallback = {}
        if (typeof subscriptionCandlesCallback[market] === 'undefined') subscriptionCandlesCallback[market] = {}
        subscriptionCandlesCallback[market][interval] = callback
        await this.checkSocket()
        doSendPublic(
          this.websocket,
          JSON.stringify({
            'action': 'subscribe',
            'channels': [{ 'name': 'candles', 'interval': [interval], 'markets': [market] }],
          }),
        )
      },

      subscriptionTrades: async function (market = '', callback) {
        if (typeof subscriptionTradesCallback === 'undefined') subscriptionTradesCallback = {}
        subscriptionTradesCallback[market] = callback
        await this.checkSocket()
        doSendPublic(
          this.websocket,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'trades', 'markets': [market] }] }),
        )
      },

      subscriptionBookUpdates: async function (market = '', callback) {
        if (typeof subscriptionBookUpdatesCallback === 'undefined') subscriptionBookUpdatesCallback = {}
        subscriptionBookUpdatesCallback[market] = callback
        await this.checkSocket()
        doSendPublic(
          this.websocket,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'book', 'markets': [market] }] }),
        )
      },

      subscriptionBook: async function (market = '', callback) {
        if (typeof subscriptionBookCallback === 'undefined') subscriptionBookCallback = {}
        subscriptionBookCallback[market] = callback
        if (typeof localBook === 'undefined') localBook = {}
        if (typeof keepLocalBookCopy === 'undefined') keepLocalBookCopy = {}
        keepLocalBookCopy[market] = true
        await this.checkSocket()
        doSendPublic(this.websocket, JSON.stringify({ 'action': 'getBook', 'market': market }))
        doSendPublic(
          this.websocket,
          JSON.stringify({ 'action': 'subscribe', 'channels': [{ 'name': 'book', 'markets': [market] }] }),
        )
      },

      unsubscribe: async function (market = '', name = undefined) {
        if (typeof name === 'undefined')
          errorToConsole(
            'Specify which channel you want to unsubscribe from (such as: ticker, ticker24h, candles, trades, account and book.)',
          )
        await this.checkSocket()
        doSendPrivate.call(
          this,
          JSON.stringify({ 'action': 'unsubscribe', 'channels': [{ 'name': name, 'markets': [market] }] }),
        )
      },
    },
  }
}
module.exports = api
