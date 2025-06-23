/*
 * This is an example utilising all functions of the node Bitvavo API wrapper.
 * The APIKEY and APISECRET should be replaced by your own key and secret.
 * For public functions the APIKEY and SECRET can be removed.
 * Documentation: https://docs.bitvavo.com
 * Bitvavo: https://bitvavo.com
 * README: https://github.com/bitvavo/node-bitvavo-api
 */
const bitvavo = require('../lib')().options({
  APIKEY: '<APIKEY>',
  APISECRET: '<APISECRET>',
  ACCESSWINDOW: 10000,
  RESTURL: 'https://api.bitvavo.com/v2',
  WSURL: 'wss://ws.bitvavo.com/v2/',
  DEBUGGING: false,
})

let testTime = async () => {
  // The Node SDK works with callbacks
  bitvavo.time((error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })
  // But also functions with promises.
  try {
    let response = await bitvavo.time()
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testMarkets = async () => {
  bitvavo.markets({}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.markets({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testAssets = async () => {
  bitvavo.assets({}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.assets({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testBook = async () => {
  bitvavo.book('BTC-EUR', {}, (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.book('BTC-EUR', {})
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testPublicTrades = async () => {
  bitvavo.publicTrades('BTC-EUR', {}, (error, response) => {
    if (error === null) {
      for (let item of response) {
        console.log(item)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.publicTrades('BTC-EUR', {})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testCandles = async () => {
  bitvavo.candles('BTC-EUR', '1h', {}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
        // 'Timestamp: ', entry[0], ' Open: ', entry[1], ' High: ', entry[2], ' Low: ', entry[3], ' Close: ', entry[4], ' Volume: ', entry[5]
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.candles('BTC-EUR', '1h', {})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testTickerPrice = async () => {
  bitvavo.tickerPrice({}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.tickerPrice({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testTickerBook = async () => {
  bitvavo.tickerBook({}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.tickerBook({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testTicker24h = async () => {
  bitvavo.ticker24h({}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.ticker24h({})
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testPlaceOrder = async () => {
  let operatorId = 1
  bitvavo.placeOrder('BTC-EUR', 'sell', 'limit', operatorId, { amount: '0.1', price: '99000' }, (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.placeOrder('BTC-EUR', 'buy', 'market', operatorId, { 'amount': '0.0001' })
    console.log(response)
  } catch (error) {
    console.log(error)
  }

  // StopLoss
  bitvavo.placeOrder(
    'BTC-EUR',
    'sell',
    'stopLoss',
    operatorId,
    { amount: '0.1', triggerType: 'price', triggerReference: 'lastTrade', triggerAmount: '85000' },
    (error, response) => {
      if (error === null) {
        console.log(response)
      } else {
        console.log(error)
      }
    },
  )
}

let testGetOrder = async () => {
  bitvavo.getOrder('BTC-EUR', 'aadbb500-835e-4ae9-b881-e2f18d1c1bff', (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.getOrder('BTC-EUR', 'aadbb500-835e-4ae9-b881-e2f18d1c1bff')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testUpdateOrder = async () => {
  let orderId = 'aadbb500-835e-4ae9-b881-e2f18d1c1bff'
  let operatorId = 1
  bitvavo.updateOrder('BTC-EUR', orderId, operatorId, { amount: '0.0002', price: '86000' }, (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.updateOrder('BTC-EUR', orderId, operatorId, {
      amount: '0.0001',
      price: '85000',
    })
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testCancelOrder = async () => {
  let orderId = 'aadbb500-835e-4ae9-b881-e2f18d1c1bff'
  let operatorId = 1
  bitvavo.cancelOrder('BTC-EUR', orderId, operatorId, (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.cancelOrder('BTC-EUR', orderId, operatorId)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testGetOrders = async () => {
  bitvavo.getOrders('BTC-EUR', {}, (error, response) => {
    if (error === null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.getOrders('BTC-EUR', {})
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testCancelOrders = async () => {
  let operatorId = 1
  bitvavo.cancelOrders({ market: 'BTC-EUR' }, operatorId, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.cancelOrders({ market: 'BTC-EUR' }, operatorId)
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testOrdersOpen = async () => {
  bitvavo.ordersOpen({ market: 'BTC-EUR' }, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.ordersOpen({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testTrades = async () => {
  bitvavo.trades('LTC-EUR', {}, (error, response) => {
    if (error === null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.trades('BTC-EUR', {})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testAccount = async () => {
  bitvavo.account((error, response) => {
    if (error == null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.account()
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testFees = async () => {
  bitvavo.fees((error, response) => {
    if (error == null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.fees()
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testBalance = async () => {
  bitvavo.balance({}, (error, response) => {
    if (error == null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.balance({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testDepositAssets = async () => {
  bitvavo.depositAssets('BTC', (error, response) => {
    if (error == null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.depositAssets('BTC')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testWithdrawAssets = async () => {
  bitvavo.withdrawAssets('BTC', '2', 'BitcoinAddress', {}, (error, response) => {
    if (error == null) {
      console.log(response)
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.withdrawAssets('BTC', 1, 'BitcoinAddress', {})
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

let testDepositHistory = async () => {
  bitvavo.depositHistory({}, (error, response) => {
    if (error == null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.depositHistory({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testWithdrawalHistory = async () => {
  bitvavo.withdrawalHistory({}, (error, response) => {
    if (error == null) {
      for (let entry of response) {
        console.log(entry)
      }
    } else {
      console.log(error)
    }
  })

  try {
    let response = await bitvavo.withdrawalHistory({})
    for (let entry of response) {
      console.log(entry)
    }
  } catch (error) {
    console.log(error)
  }
}

let testRestApi = async () => {
  testTime()
  // testMarkets()
  // testAssets()

  // testBook()
  // testPublicTrades()
  // testCandles()

  // testTickerPrice()
  // testTickerBook()
  // testTicker24h()

  // testPlaceOrder()
  // testUpdateOrder()
  // testGetOrder()
  // testCancelOrder()
  // testGetOrders()
  // testCancelOrders()
  // testOrdersOpen()

  // testTrades()

  // testAccount()
  // testFees()
  // testBalance()
  // testDepositAssets()
  // testWithdrawAssets()
  // testDepositHistory()
  // testWithdrawalHistory()
}

let websocketSetListeners = async () => {
  let emitter = bitvavo.getEmitter()

  emitter.on('time', (response) => {
    console.log('TimeResponse', response)
  })
  emitter.on('markets', (response) => {
    console.log('MarketsResponse', response)
  })
  emitter.on('assets', (response) => {
    console.log('AssetsResponse', response)
  })
  emitter.on('book', (response) => {
    console.log('BookResponse', response)
  })
  emitter.on('publicTrades', (response) => {
    console.log('PublicTradesResponse', response)
  })
  emitter.on('candles', (response) => {
    console.log('CandlesResponse', response)
  })
  emitter.on('ticker24h', (response) => {
    console.log('Ticker24hResponse', response)
  })
  emitter.on('tickerPrice', (response) => {
    console.log('TickerPriceResponse', response)
  })
  emitter.on('tickerBook', (response) => {
    console.log('TickerBookResponse', response)
  })
  emitter.on('placeOrder', (response) => {
    console.log('PlaceOrderResponse', response)
  })
  emitter.on('updateOrder', (response) => {
    console.log('UpdateOrderResponse', response)
  })
  emitter.on('getOrder', (response) => {
    console.log('GetOrderResponse', response)
  })
  emitter.on('cancelOrder', (response) => {
    console.log('CancelOrderResponse', response)
  })
  emitter.on('getOrders', (response) => {
    console.log('GetOrdersResponse', response)
  })
  emitter.on('cancelOrders', (response) => {
    console.log('CancelOrdersResponse', response)
  })
  emitter.on('ordersOpen', (response) => {
    console.log('OrdersOpenResponse', response)
  })
  emitter.on('trades', (response) => {
    console.log('TradesResponse', response)
  })
  emitter.on('account', (response) => {
    console.log('AccountResponse', response)
  })
  emitter.on('fees', (response) => {
    console.log('FeesResponse', response)
  })
  emitter.on('balance', (response) => {
    console.log('BalanceResponse', response)
  })
  emitter.on('depositAssets', (response) => {
    console.log('DepositAssetsResponse', response)
  })
  emitter.on('withdrawAssets', (response) => {
    console.log('WithdrawAssetsResponse', response)
  })
  emitter.on('depositHistory', (response) => {
    console.log('DepositHistoryResponse', response)
  })
  emitter.on('withdrawalHistory', (response) => {
    console.log('WithdrawalHistoryResponse', response)
  })
  emitter.on('error', (response) => {
    console.log('We caught error ', response)
  })
}

let testWebSockets = async () => {
  bitvavo.websocket.time()
  // bitvavo.websocket.markets({})
  // bitvavo.websocket.assets({})

  // bitvavo.websocket.book('BTC-EUR', {})
  // bitvavo.websocket.publicTrades('BTC-EUR', {})
  // bitvavo.websocket.candles('BTC-EUR', '1h', { limit: 10 })

  // bitvavo.websocket.ticker24h({ market: 'BTC-EUR' })
  // bitvavo.websocket.tickerPrice({ market: 'BTC-EUR' })
  // bitvavo.websocket.tickerBook({ market: 'BTC-EUR' })

  let operatorId = 1
  // bitvavo.websocket.placeOrder('BTC-EUR', 'sell', 'limit', operatorId, { amount: '0.01', price: '97000' })
  // bitvavo.websocket.getOrder('BTC-EUR', '89c1a7f6-5fa1-4fa6-8a8d-aa2388798d4a')
  // bitvavo.websocket.updateOrder('BTC-EUR', 'bc86d303-c199-404d-b742-f9b3a030916f', operatorId,{ amount: '0.012' })
  // bitvavo.websocket.cancelOrder('BTC-EUR', 'bc86d303-c199-404d-b742-f9b3a030916f', operatorId)
  // bitvavo.websocket.getOrders('BTC-EUR', { limit: 10 })
  // bitvavo.websocket.cancelOrders({ market: 'BTC-EUR' }, operatorId)
  // bitvavo.websocket.ordersOpen({ market: 'BTC-EUR' })
  // bitvavo.websocket.trades('BTC-EUR', {})

  // bitvavo.websocket.account()
  // bitvavo.websocket.fees()
  // bitvavo.websocket.fees('BTC-EUR')
  // bitvavo.websocket.balance({})
  // bitvavo.websocket.depositAssets('BTC')
  // bitvavo.websocket.withdrawAssets('BTC', '1', 'BitcoinAddress', {})
  // bitvavo.websocket.depositHistory({})
  // bitvavo.websocket.withdrawalHistory({})

  // bitvavo.websocket.subscriptionTicker('BTC-EUR', (response) => {
  //   console.log('Subscription Ticker response', response)
  // })
  // bitvavo.websocket.subscriptionTicker24h('BTC-EUR', (response) => {
  //   console.log('Subscription Ticker 24 hour response', response)
  // })
  // bitvavo.websocket.subscriptionAccount('BTC-EUR', (response) => {
  //   console.log('Subscription Account response', response)
  // })
  // bitvavo.websocket.subscriptionCandles('BTC-EUR', '1h', (response) => {
  //   console.log('Subscription Candles response', response)
  // })
  // bitvavo.websocket.subscriptionTrades('BTC-EUR', (response) => {
  //   console.log('BTC-EUR subscription trades response', response)
  // })
  // bitvavo.websocket.subscriptionBookUpdates('BTC-EUR', (response) => {
  //   console.log('Received subscription book response', response)
  // })
  // bitvavo.websocket.subscriptionBook('BTC-EUR', (book) => {
  //   console.log('Received update to the order book BTC-EUR', book)
  // })
}

let main = async () => {
  console.log('Our remaining rate limit at the moment is', bitvavo.getRemainingLimit())
  testRestApi()

  websocketSetListeners()
  testWebSockets()
}

main()
