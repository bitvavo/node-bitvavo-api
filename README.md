<p align="center">
  <a href="https://www.bitvavo.com"><img src="https://bitvavo.com/media/images/logo/bitvavoGeneral.svg" width="600" title="Bitvavo Logo">
  <br>
  <br>
  <a href="https://github.com/bitvavo/node-bitvavo-api.git" alt="Downloads">
  <img src="https://img.shields.io/npm/dt/bitvavo.svg?style=flat-square" /></a>
</p>

# Node Bitvavo Api
This is the Node.js wrapper for the Bitvavo API. This project can be used to build your own projects which interact with the Bitvavo platform. Every function available on the API can be called through a REST request or over websockets. For info on the specifics of every parameter consult the [documentation](https://docs.bitvavo.com/)

* Getting started       [REST](#getting-started) [Websocket](#getting-started-1)
* General
  * Time                [REST](#get-time) [Websocket](#get-time-1)
  * Markets             [REST](#get-markets) [Websocket](#get-markets-1)
  * Assets              [REST](#get-assets) [Websocket](#get-assets-1)
* Market Data
  * Book                [REST](#get-book-per-market) [Websocket](#get-book-per-market-1)
  * Public Trades       [REST](#get-trades-per-market) [Websocket](#get-trades-per-market-1)
  * Candles             [REST](#get-candles-per-market) [Websocket](#get-candles-per-market-1)
  * Price Ticker        [REST](#get-price-ticker) [Websocket](#get-price-ticker-1)
  * Book Ticker         [REST](#get-book-ticker) [Websocket](#get-book-ticker-1)
  * 24 Hour Ticker      [REST](#get-24-hour-ticker) [Websocket](#get-24-hour-ticker-1)
* Private 
  * Place Order         [REST](#place-order) [Websocket](#place-order-1)
  * Update Order        [REST](#update-order) [Websocket](#update-order-1)
  * Get Order           [REST](#get-order) [Websocket](#get-order-1)
  * Cancel Order        [REST](#cancel-order) [Websocket](#cancel-order-1)
  * Get Orders          [REST](#get-orders) [Websocket](#get-orders-1)
  * Cancel Orders       [REST](#cancel-orders) [Websocket](#cancel-orders-1)
  * Orders Open         [REST](#get-orders-open) [Websocket](#get-orders-open-1)
  * Trades              [REST](#get-trades) [Websocket](#get-trades-1)
  * Balance             [REST](#get-balance) [Websocket](#get-balance-1)
  * Deposit Assets     [REST](#deposit-assets) [Websocket](#deposit-assets-1)
  * Withdraw Assets   [REST](#withdraw-assets) [Websocket](#withdraw-assets-1)
  * Deposit History     [REST](#get-deposit-history) [Websocket](#get-deposit-history-1)
  * Withdrawal History  [REST](#get-withdrawal-history) [Websocket](#get-withdrawal-history-1)
* [Subscriptions](#subscriptions)
  * [Ticker Subscription](#ticker-subscription)
  * [Account Subscription](#account-subscription)
  * [Candles Subscription](#candles-subscription)
  * [Trades Subscription](#trades-subscription)
  * [Book Subscription](#book-subscription)
  * [Book Subscription With Local Copy](#book-subscription-with-local-copy)

## Installation
```
npm i bitvavo
```

## REST requests

The general convention used in all functions (both REST and websockets), is that all optional parameters are passed as an object, while required parameters are passed as separate values. Only when [placing orders](#place-order) some of the optional parameters are required, since a limit order requires more information than a market order. The returned responses are all converted to an object as well, such that `response['<key>'] = '<value>'` and `response.<key> = '<value>'`.

### Getting started

The API key and secret are required for private calls and optional for public calls. The access window and debugging parameter are optional for all calls. The access window is used to determine whether the request arrived within time, the value is specified in milliseconds. You can use the [time](#get-time) function to synchronize your time to our server time if errors arise. Debugging should be set to true when you want to log additional information and full responses. Any parameter can be omitted, private functions will return an error when the api key and secret have not been set.

```javascript
const bitvavo = require('bitvavo')().options({
  APIKEY: '<APIKEY>',
  APISECRET: '<APISECRET>',
  ACCESSWINDOW: 10000,
  DEBUGGING: true
})
```
Our Node wrapper functions both with [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and with [callbacks](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function). This means that the following two functions have the same effect.

```javascript
// Callback
bitvavo.time((error, response) => {
  if (error === null) {
    console.log('Handle the response here', response)
  } else {
    console.log('Handle the error here', error)
  }
})

// Promise
try {
  let response = await bitvavo.time()
  console.log('Handle the response here', response)
} catch (error) {
  console.log('Handle errors here', error)
}
```


### General

#### Get time
```javascript
// Function with callback
bitvavo.time((error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
try {
  let response = await bitvavo.time()
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ time: 1543478503490 }
```
</details>

#### Get markets
```javascript
// Function with callback
// options: market
bitvavo.markets({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.markets({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ADA-BTC',
  status: 'trading',
  base: 'ADA',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '100',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'ADA-EUR',
  status: 'trading',
  base: 'ADA',
  quote: 'EUR',
  pricePrecision: 5,
  minOrderInBaseAsset: '100',
  minOrderInQuoteAsset: '10',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AE-BTC',
  status: 'trading',
  base: 'AE',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '10',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AE-EUR',
  status: 'trading',
  base: 'AE',
  quote: 'EUR',
  pricePrecision: 5,
  minOrderInBaseAsset: '10',
  minOrderInQuoteAsset: '10',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AION-BTC',
  status: 'trading',
  base: 'AION',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '30',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
  ...
```
</details>

#### Get assets
```javascript
// Function with callback
// options: symbol
bitvavo.assets({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: symbol
try {
  let response = await bitvavo.assets({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ symbol: 'ADA',
  name: 'Cardano',
  decimals: 6,
  depositFee: '0',
  depositConfirmations: 30,
  depositStatus: 'OK',
  withdrawalFee: '0.2',
  withdrawalMinAmount: '0.2',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BAT',
  name: 'Basic Attention Token',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 20,
  depositStatus: 'OK',
  withdrawalFee: '7',
  withdrawalMinAmount: '7',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BCH',
  name: 'Bitcoin Cash',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 20,
  depositStatus: 'OK',
  withdrawalFee: '0.0001',
  withdrawalMinAmount: '0.00001',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BTC',
  name: 'Bitcoin',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 3,
  depositStatus: 'OK',
  withdrawalFee: '0.00006',
  withdrawalMinAmount: '0.00001',
  withdrawalStatus: 'OK',
  message: '' }
  ...  
```
</details>

### Market Data

#### Get book per market
```javascript
// Function with callback
// options: depth
bitvavo.book('BTC-EUR', {}, (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
// options: depth
try {
  let response = await bitvavo.book('BTC-EUR', {})
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'BTC-EUR',
  nonce: 39785,
  bids:
   [ [ '3304', '0.00303' ],
     [ '3297.2', '0.0030344' ],
     [ '3290.2', '0.00304085' ],
     [ '3283.9', '0.00304669' ],
     [ '3277.6', '0.00305254' ],
     [ '3269.5', '0.00306011' ],
     [ '3262.9', '0.0030663' ],
     [ '3256.5', '0.00307232' ],
     [ '3249.7', '0.00307875' ],
     [ '3243', '0.00308511' ],
     [ '3236.4', '0.0030914' ],
     [ '3229.8', '0.00309772' ],
     [ '3224.1', '0.0031032' ],
     [ '3217.5', '0.00310956' ],
     [ '3210', '0.00311683' ],
     [ '3203.4', '0.00312325' ],
     [ '3197.7', '0.00312882' ],
     [ '3186.3', '0.00314001' ],
     [ '3182.3', '0.00314396' ],
     [ '3177.7', '0.00314851' ],
     [ '3166.6', '0.00315955' ],
     [ '3160', '0.00316614' ],
     [ '3153.4', '0.00317277' ],
     [ '3146.8', '0.00317943' ],
     [ '3138.7', '0.00318763' ] ],
  asks:
   [ [ '3310.7', '0.00302503' ],
     [ '3317.4', '0.00302494' ],
     [ '3324.1', '0.00302494' ],
     [ '3330.7', '0.00302494' ],
     [ '3337.3', '0.00302494' ],
     [ '3343.9', '0.00302494' ],
     [ '3350.5', '0.00302494' ],
     [ '3357.1', '0.00302503' ],
     [ '3366.3', '0.00302266' ],
     [ '3372.9', '0.00302266' ],
     [ '3379.6', '0.00302266' ],
     [ '3386.2', '0.00302266' ],
     [ '3392.8', '0.00302266' ],
     [ '3399.5', '0.00302266' ],
     [ '3401.3', '0.00302687' ],
     [ '3408', '0.00302687' ],
     [ '3414.4', '0.00302705' ],
     [ '3420.8', '0.00302723' ],
     [ '3427', '0.0030276' ],
     [ '3433.3', '0.00302787' ],
     [ '3439.1', '0.00302861' ],
     [ '3445.7', '0.00302861' ],
     [ '3451.9', '0.00302897' ],
     [ '3458.2', '0.00302925' ],
     [ '3464.3', '0.00302971' ],
     [ '3500.1', '0.002032' ] ] }
```
</details>

#### Get trades per market
```javascript
// Function with callback
// options: limit, start, end, tradeId
bitvavo.publicTrades('BTC-EUR', {}, (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
// options: limit, start, end, tradeId
try {
  let response = await bitvavo.publicTrades('BTC-EUR', {})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ id: '5400feff-54b8-40a3-90d4-5f0f68f28c25',
  timestamp: 1545213249947,
  amount: '0.001',
  price: '3500.1',
  side: 'buy' }
{ id: '0294c35a-c2d3-41b3-9f6d-759312c51e8d',
  timestamp: 1545213234550,
  amount: '0.003039',
  price: '3453.7',
  side: 'buy' }
{ id: '3501ca58-3980-4797-bccc-70fd58405c96',
  timestamp: 1545213234535,
  amount: '0.003039',
  price: '3447.1',
  side: 'buy' }
{ id: '6ac6944d-870c-466d-bec3-f03d1cc43409',
  timestamp: 1545213234521,
  amount: '0.00303191',
  price: '3441.9',
  side: 'buy' }
{ id: 'f79a2d5d-4839-4191-b0b3-65044bb4861d',
  timestamp: 1545213234508,
  amount: '0.003039',
  price: '3440.5',
  side: 'buy' }
{ id: '8a5cf6c5-d802-4f05-a6bc-63e0ad79423a',
  timestamp: 1545213234491,
  amount: '0.00303568',
  price: '3431.1',
  side: 'buy' }
{ id: '896c451f-a5f2-4b77-80d0-5b095a90d139',
  timestamp: 1545213234479,
  amount: '0.00303568',
  price: '3424.5',
  side: 'buy' }
{ id: '300bc05a-f63a-4ad2-ba87-b7b3900a4ed9',
  timestamp: 1545213234458,
  amount: '0.00303375',
  price: '3420',
  side: 'buy' }
  ...
```
</details>

#### Get candles per market
```javascript
// Function with callback
// options: limit, start, end
bitvavo.candles('BTC-EUR', '1h', {}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: limit, start, end
try {
  let response = await bitvavo.candles('BTC-EUR', '1h', {})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}

// Return parameters are: 'Timestamp: ', entry[0], ' Open: ', entry[1], ' High: ', entry[2],
//                        ' Low: ', entry[3], ' Close: ', entry[4], ' Volume: ', entry[5]
```
<details>
 <summary>View Response</summary>

```javascript
[ 1545210000000, '3308.2', '3500.1', '3308.2', '3500.1', '0.07684055' ]
[ 1545138000000, '3158.2', '3199.6', '3158.2', '3199.6', '0.02477561' ]
[ 1545134400000, '3154.8', '3158.2', '3154.8', '3158.2', '0.003' ]
[ 1545130800000, '3154.8', '3154.8', '3154.8', '3154.8', '0.001' ]
[ 1545210000000, '3308.2', '3500.1', '3308.2', '3500.1', '0.07684055' ]
[ 1545138000000, '3158.2', '3199.6', '3158.2', '3199.6', '0.02477561' ]
[ 1545134400000, '3154.8', '3158.2', '3154.8', '3158.2', '0.003' ]
[ 1545130800000, '3154.8', '3154.8', '3154.8', '3154.8', '0.001' ]
 ...
```
</details>

#### Get price ticker
```javascript
// Function with callback
// options: market
bitvavo.tickerPrice({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.tickerPrice({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'XRP-BTC', price: '0.000097983' }
{ market: 'MIOTA-BTC', price: '0.000078189' }
{ market: 'LSK-BTC', price: '0.00034486' }
{ market: 'BCH-EUR', price: '102.1' }
{ market: 'XRP-EUR', price: '0.32418' }
{ market: 'AE-BTC', price: '0.00011033' }
{ market: 'AION-BTC', price: '0.000034426' }
{ market: 'ANT-BTC', price: '0.00011455' }
{ market: 'ARK-BTC', price: '0.00009624' }
{ market: 'BAT-BTC', price: '0.000037708' }
{ market: 'BTC-EUR', price: '3500.1' }
{ market: 'CMT-BTC', price: '0.000006695' }
{ market: 'DCR-BTC', price: '0.0048841' }
{ market: 'DGB-BTC', price: '0.0000030977' }
{ market: 'ELF-EUR', price: '0.10219' }
{ market: 'EOS-BTC', price: '0.00068749' }
{ market: 'ETC-BTC', price: '0.0011361' }
{ market: 'ETH-BTC', price: '0.027504' }
{ market: 'GAS-BTC', price: '0.0005364' }
{ market: 'GNT-BTC', price: '0.000018384' }
{ market: 'ICX-EUR', price: '0.17683' }
{ market: 'LRC-BTC', price: '0.000011178' }
{ market: 'LTC-EUR', price: '24.622' }
{ market: 'NANO-BTC', price: '0.00025949' }
{ market: 'NAS-EUR', price: '0.46102' }
{ market: 'NEO-BTC', price: '0.0018661' }
{ market: 'NEO-EUR', price: '5.6134' }
{ market: 'OMG-BTC', price: '0.000365' }
{ market: 'ONT-BTC', price: '0.00018014' }
{ market: 'ONT-EUR', price: '0.48529' }
{ market: 'POWR-BTC', price: '0.000020786' }
{ market: 'POWR-EUR', price: '0.068639' }
{ market: 'QTUM-EUR', price: '1.9927' }
{ market: 'RDD-EUR', price: '0.0011917' }
...
```
</details>

#### Get book ticker
```javascript
// Function with callback
// options: market
bitvavo.tickerBook({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.tickerBook({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ANT-EUR', bid: '0.37294', ask: '0.3782' }
{ market: 'AION-EUR', bid: '0.11375', ask: '0.11376' }
{ market: 'AE-EUR', bid: '0.36224', ask: '0.36508' }
{ market: 'DGB-EUR', bid: '0.010111', ask: '0.010237' }
{ market: 'CMT-EUR', bid: '0.021978', ask: '0.022123' }
{ market: 'BCH-EUR', bid: '100.81', ask: '101.73' }
{ market: 'ADA-EUR', bid: '0.031411', ask: '0.031415' }
{ market: 'ARK-EUR', bid: '0.31809', ask: '0.3181' }
{ market: 'GAS-EUR', bid: '1.7675', ask: '1.7725' }
{ market: 'BAT-EUR', bid: '0.12456', ask: '0.1246' }
{ market: 'DCR-EUR', bid: '16.018', ask: '16.108' }
{ market: 'MIOTA-EUR', bid: '0.25656', ask: '0.25846' }
{ market: 'ETH-EUR', bid: '89.987', ask: '89.988' }
{ market: 'RDD-EUR', bid: '0.0011564', ask: '0.0011917' }
{ market: 'ETC-EUR', bid: '3.7418', ask: '3.7483' }
{ market: 'NANO-EUR', bid: '0.85528', ask: '0.8575' }
{ market: 'GNT-EUR', bid: '0.059622', ask: '0.060773' }
{ market: 'ONT-EUR', bid: '0.58367', ask: '0.60012' }
{ market: 'LSK-EUR', bid: '1.2082', ask: '1.2502' }
{ market: 'VTC-EUR', bid: '0.23109', ask: '0.23318' }
{ market: 'OMG-EUR', bid: '1.1963', ask: '1.2042' }
{ market: 'NEO-EUR', bid: '6.1506', ask: '6.1699' }
{ market: 'SUB-EUR', bid: '0.04089', ask: '0.041101' }
{ market: 'QTUM-EUR', bid: '1.9849', ask: '1.9927' }
{ market: 'STORM-EUR', bid: '0.0027308', ask: '0.0027623' }
{ market: 'SNT-EUR', bid: '0.014299', ask: '0.014444' }
{ market: 'VET-EUR', bid: '0.003674', ask: '0.0037079' }
{ market: 'STEEM-EUR', bid: '0.23534', ask: '0.23579' }
{ market: 'XEM-EUR', bid: '0.059711', ask: '0.060419' }
{ market: 'POWR-EUR', bid: '0.068482', ask: '0.068639' }
{ market: 'ANT-BTC', bid: '0.00011259', ask: '0.00011441' }
{ market: 'WTC-EUR', bid: '0.97266', ask: '0.97931' }
{ market: 'ELF-EUR', bid: '0.10122', ask: '0.10219' }
{ market: 'XLM-EUR', bid: '0.104', ask: '0.10414' }
{ market: 'NAS-EUR', bid: '0.54514', ask: '0.54577' }
{ market: 'AE-BTC', bid: '0.00010942', ask: '0.00011033' }
{ market: 'ICX-EUR', bid: '0.19765', ask: '0.19916' }
{ market: 'ZIL-EUR', bid: '0.014306', ask: '0.014379' }
{ market: 'AION-BTC', bid: '0.000034374', ask: '0.000034426' }
...
```
</details>

#### Get 24 hour ticker
```javascript
// Function with callback
// options: market
bitvavo.ticker24h({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.ticker24h({})
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ADA-BTC',
  open: '0.0000095071',
  high: '0.0000095071',
  low: '0.0000095071',
  last: '0.0000095071',
  volume: '1',
  volumeQuote: '0.00000951' }
{ market: 'ADA-EUR',
  open: '0.031415',
  high: '0.031415',
  low: '0.031415',
  last: '0.031415',
  volume: '1',
  volumeQuote: '0.03' }
{ market: 'AE-BTC',
  open: '0.00011033',
  high: '0.00011033',
  low: '0.00011033',
  last: '0.00011033',
  volume: '1',
  volumeQuote: '0.00011033' }
{ market: 'AE-EUR',
  open: '0.36508',
  high: '0.36508',
  low: '0.36508',
  last: '0.36508',
  volume: '1',
  volumeQuote: '0.37' }
{ market: 'AION-BTC',
  open: '0.000034426',
  high: '0.000034426',
  low: '0.000034426',
  last: '0.000034426',
  volume: '1',
  volumeQuote: '0.00003443' }
{ market: 'AION-EUR',
  open: '0.11376',
  high: '0.11376',
  low: '0.11376',
  last: '0.11376',
  volume: '1',
  volumeQuote: '0.11' }
{ market: 'ANT-BTC',
  open: '0.00011455',
  high: '0.00011455',
  low: '0.00011455',
  last: '0.00011455',
  volume: '1',
  volumeQuote: '0.00011455' }
{ market: 'ANT-EUR',
  open: '0.3785',
  high: '0.3785',
  low: '0.3785',
  last: '0.3785',
  volume: '1',
  volumeQuote: '0.38' }
{ market: 'ARK-BTC',
  open: '0.00009624',
  high: '0.00009624',
  low: '0.00009624',
  last: '0.00009624',
  volume: '1',
  volumeQuote: '0.00009624' }
{ market: 'ARK-EUR',
  open: '0.3181',
  high: '0.3181',
  low: '0.3181',
  last: '0.3181',
  volume: '1',
  volumeQuote: '0.32' }
{ market: 'BAT-BTC',
  open: '0.000037708',
  high: '0.000037708',
  low: '0.000037708',
  last: '0.000037708',
  volume: '1',
  volumeQuote: '0.00003771' }
...
```
</details>


### Private

#### Place order
When placing an order, make sure that the correct optional parameters are set. For a limit order it is required to set both the amount and price. A market order is valid if either the amount or the amountQuote has been set.
```javascript
// Function with callback
// Optional parameters: limit:(amount, price, postOnly), market:(amount, amountQuote, disableMarketProtection),
// both: timeInForce, selfTradePrevention, responseRequired
bitvavo.placeOrder('BTC-EUR', 'sell', 'limit', { amount: '1', price: '3000' }, (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
// Optional parameters: limit:(amount, price, postOnly), market:(amount, amountQuote, disableMarketProtection),
// both: timeInForce, selfTradePrevention, responseRequired
try {
  let response = await bitvavo.placeOrder('BTC-EUR', 'sell', 'limit', { 'amount': '1', 'price': 3000 })
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '6a57e514-60aa-4a91-8958-5e70fa5c0ed3',
  market: 'BTC-EUR',
  created: 1548668202114,
  updated: 1548668202114,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '1',
  amountRemaining: '1',
  price: '3000',
  onHold: '3007.5',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledAmountQuote: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Update order
When updating an order make sure that at least one of the optional parameters has been set. Otherwise nothing can be updated.
```javascript
// Function with callback
// Optional parameters: limit:(amount, price, timeInForce, selfTradePrevention, postOnly) (set at least 1)
bitvavo.updateOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092', { price: 4500 }, (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
// Optional parameters: limit:(amount, amountRemaining, price, timeInForce, selfTradePrevention, postOnly)
// (set at least 1) (responseRequired can be set as well, but does not update anything)
try {
  let response = await bitvavo.updateOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092', { amount: 0.2 })
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '6a57e514-60aa-4a91-8958-5e70fa5c0ed3',
  market: 'BTC-EUR',
  created: 1548668202114,
  updated: 1548668368746,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '0.5',
  amountRemaining: '0.5',
  price: '3000',
  onHold: '1503.75',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledAmountQuote: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Get order
```javascript
// Function with callback
bitvavo.getOrder('BTC-EUR', '6a57e514-60aa-4a91-8958-5e70fa5c0ed3', (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
try {
  let response = await bitvavo.getOrder('BTC-EUR', '6a57e514-60aa-4a91-8958-5e70fa5c0ed3')
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '6a57e514-60aa-4a91-8958-5e70fa5c0ed3',
  market: 'BTC-EUR',
  created: 1548668202114,
  updated: 1548668202114,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '1',
  amountRemaining: '1',
  price: '3000',
  onHold: '3007.5',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledAmountQuote: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Cancel order
```javascript
// Function with callback
bitvavo.cancelOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092', (error, response) => {
  if (error === null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
try {
  let response = await bitvavo.cancelOrder('BTC-EUR', '99e9a45b-26c8-4079-9da2-f0f42e008edb')
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092' }
```
</details>

#### Get orders
Returns the same as get order, but can be used to return multiple orders at once.
```javascript
// Function with callback
// options: orderId, limit, start, end
bitvavo.getOrders('BTC-EUR', {}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: orderId, limit, start, end
try {
  let response = await bitvavo.getOrders('BTC-EUR', {})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
[
  { orderId: '6a57e514-60aa-4a91-8958-5e70fa5c0ed3',
    market: 'BTC-EUR',
    created: 1548668202114,
    updated: 1548668368746,
    status: 'new',
    side: 'buy',
    orderType: 'limit',
    amount: '0.5',
    amountRemaining: '0.5',
    price: '3000',
    onHold: '1503.75',
    onHoldCurrency: 'EUR',
    filledAmount: '0',
    filledAmountQuote: '0',
    feePaid: '0',
    feeCurrency: 'EUR',
    fills: [],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false },
  { orderId: 'b8c6c4d1-eb8c-4b24-83e1-fcced3df168d',
    market: 'BTC-EUR',
    created: 1548666712066,
    updated: 1548666712066,
    status: 'filled',
    side: 'buy',
    orderType: 'limit',
    amount: '0.1',
    amountRemaining: '0',
    price: '4000',
    onHold: '0',
    onHoldCurrency: 'EUR',
    filledAmount: '0.1',
    filledAmountQuote: '400',
    feePaid: '1',
    feeCurrency: 'EUR',
    fills: [ [Object] ],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false },
  { orderId: '198a85ce-1cb2-44b9-acb1-6cb9a1dde555',
    market: 'BTC-EUR',
    created: 1548666514216,
    updated: 1548666514216,
    status: 'filled',
    side: 'buy',
    orderType: 'limit',
    amount: '0.1',
    amountRemaining: '0',
    price: '4000',
    onHold: '0',
    onHoldCurrency: 'EUR',
    filledAmount: '0.1',
    filledAmountQuote: '400',
    feePaid: '0.8',
    feeCurrency: 'EUR',
    fills: [ [Object] ],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false },
  { orderId: 'e68dd35c-156b-4f50-92d8-ff24623fba03',
    market: 'BTC-EUR',
    created: 1548666373398,
    updated: 1548666373398,
    status: 'filled',
    side: 'buy',
    orderType: 'limit',
    amount: '0.1',
    amountRemaining: '0',
    price: '4000',
    onHold: '0',
    onHoldCurrency: 'EUR',
    filledAmount: '0.1',
    filledAmountQuote: '400',
    feePaid: '1',
    feeCurrency: 'EUR',
    fills: [ [Object] ],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false }
    ...
]
```
</details>

#### Cancel orders
Cancels all orders in a market. If no market is specified, all orders of an account will be canceled.
```javascript
// Function with callback
// options: market
bitvavo.cancelOrders({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.cancelOrders({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '7e7a20ce-44f2-401c-aaca-64f36e6f3e09' }
{ orderId: '35f17a0c-3344-452c-b348-20f3424574b8' }
...
```
</details>

#### Get orders open
Returns all orders which are not filled or canceled.
```javascript
// Function with callback
// options: market
bitvavo.ordersOpen({}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: market
try {
  let response = await bitvavo.ordersOpen({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
[ 
  { orderId: '6a57e514-60aa-4a91-8958-5e70fa5c0ed3',
    market: 'BTC-EUR',
    created: 1548668202114,
    updated: 1548668368746,
    status: 'new',
    side: 'buy',
    orderType: 'limit',
    amount: '0.5',
    amountRemaining: '0.5',
    price: '3000',
    onHold: '1503.75',
    onHoldCurrency: 'EUR',
    filledAmount: '0',
    filledAmountQuote: '0',
    feePaid: '0',
    feeCurrency: 'EUR',
    fills: [],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false },
  { orderId: '96cd3157-a6cb-4d7f-9a1d-8041c29dc982',
    market: 'BTC-EUR',
    created: 1545216249448,
    updated: 1545216249448,
    status: 'new',
    side: 'buy',
    orderType: 'limit',
    amount: '0.1',
    amountRemaining: '0.1',
    price: '2900',
    onHold: '290.73',
    onHoldCurrency: 'EUR',
    filledAmount: '0',
    filledAmountQuote: '0',
    feePaid: '0',
    feeCurrency: 'EUR',
    fills: [],
    selfTradePrevention: 'decrementAndCancel',
    visible: true,
    timeInForce: 'GTC',
    postOnly: false },
    ...
]
```
</details>

#### Get trades
Returns all trades within a market for this account.
```javascript
// Function with callback
// options: limit, start, end, tradeId
bitvavo.trades('LTC-EUR', {}, (error, response) => {
  if (error === null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: limit, start, end, tradeId
try {
  let response = await bitvavo.trades('BTC-EUR', {})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
[ 
  { id: '79e4bf2f-4fac-4895-9bb2-a5c9c6e2ff3f',
    timestamp: 1548666712071,
    market: 'BTC-EUR',
    side: 'buy',
    amount: '0.1',
    price: '4000',
    taker: true,
    fee: '1',
    feeCurrency: 'EUR',
    settled: true },
  { id: '102486d3-5b72-4fa2-89cf-84c934edb7ae',
    timestamp: 1548666561486,
    market: 'BTC-EUR',
    side: 'buy',
    amount: '0.1',
    price: '4000',
    taker: false,
    fee: '0.8',
    feeCurrency: 'EUR',
    settled: true },
  { id: '965facc7-b3c3-43d0-8a1d-30a2f782ee17',
    timestamp: 1548666373407,
    market: 'BTC-EUR',
    side: 'buy',
    amount: '0.1',
    price: '4000',
    taker: true,
    fee: '1',
    feeCurrency: 'EUR',
    settled: true },
  ...
]
```
</details>

#### Get balance
Returns the balance for this account.
```javascript
// Function with callback
// options: symbol
bitvavo.balance({}, (error, response) => {
  if (error == null) {
    for (let entry of response) {
      console.log(response)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: symbol
try {
  let response = await bitvavo.balance({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ symbol: 'EUR', available: '1179.28', inOrder: '17738.27' }
{ symbol: 'BTC', available: '3.99704969', inOrder: '0' }
{ symbol: 'ADA', available: '123.1', inOrder: '0' }
{ symbol: 'BCH', available: '3.99704969', inOrder: '0' }
{ symbol: 'BSV', available: '3.99704969', inOrder: '0' }
{ symbol: 'DASH', available: '53', inOrder: '0' }
{ symbol: 'EOS', available: '79.267', inOrder: '1.3562' }
{ symbol: 'ETH', available: '45.435', inOrder: '0' }
{ symbol: 'LTC', available: '10', inOrder: '0' }
{ symbol: 'NEO', available: '243.4', inOrder: '0' }
{ symbol: 'QTUM', available: '13', inOrder: '0' }
{ symbol: 'TRX', available: '45', inOrder: '0' }
{ symbol: 'XEM', available: '34.43', inOrder: '0' }
{ symbol: 'XLM', available: '324', inOrder: '0' }
...
```
</details>

#### Deposit assets
Returns the address which can be used to deposit funds.
```javascript
// Function with callback
bitvavo.depositAssets('BTC', (error, response) => {
  if (error == null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
try {
  let response = await bitvavo.depositAssets('BTC')
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ address: 'BitcoinAddress'}
```
</details>

#### Withdraw Assets
Can be used to withdraw funds from Bitvavo.
```javascript
// Function with callback
// Optional parameters: paymentId, internal, addWithdrawalFee
bitvavo.withdrawAssets('BTC', 1, 'BitcoinAddress', {}, (error, response) => {
  if (error == null) {
    console.log(response)
  } else {
    console.log(error)
  }
})

// Function with promise
// Optional parameters: paymentId, internal, addWithdrawalFee
try {
  let response = await bitvavo.withdrawAssets('BTC', 1, 'BitcoinAddress', {})
  console.log(response)
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ success: true, symbol: 'BTC', amount: '1' }
```
</details>

#### Get deposit history
Returns the deposit history of your account.
```javascript
// Function with callback
// options: symbol, limit, start, end
bitvavo.depositHistory({}, (error, response) => {
  if (error == null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: symbol, limit, start, end
try {
  let response = await bitvavo.depositHistory({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ timestamp: 1545226978000,
  symbol: 'BTC',
  amount: '1.35',
  address: '',
  paymentId: '',
  txId: '387a2cd34ac0dcaf0b63d374e703e227f39984808d52951c81283f23ea107088',
  fee: '0',
  status: 'completed' }
{ timestamp: 1545226940000,
  symbol: 'XRP',
  amount: '121.11',
  address: '',
  paymentId: '',
  txId: 'EAB486A626819D87C848AA46F6B0B3C4B944D0304F5C7FA6D7D31DBDD7C662EA',
  fee: '0',
  status: 'completed' }
  ...
```
</details>

#### Get withdrawal history
Returns the withdrawal history of an account.
```javascript
// Function with callback
// options: symbol, limit, start, end
bitvavo.withdrawalHistory({}, (error, response) => {
  if (error == null) {
    for (let entry of response) {
      console.log(entry)
    }
  } else {
    console.log(error)
  }
})

// Function with promise
// options: symbol, limit, start, end
try {
  let response = await bitvavo.withdrawalHistory({})
  for (let entry of response) {
    console.log(entry)
  }
} catch (error) {
  console.log(error)
}
```
<details>
 <summary>View Response</summary>

```javascript
{ timestamp: 1543485186000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485186000,
  symbol: 'BTC',
  amount: '1.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485176000,
  symbol: 'BTC',
  amount: '1.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485175000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543400914000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
  ...
```
</details>

## Websockets

All requests which can be done through REST requests can also be performed over websockets. Bitvavo also provides five [subscriptions](#subscriptions). If subscribed to these, updates specific for that type/market are pushed immediately.

### Getting started

It is not necessary to initialise the websocket through a function, it will automatically be initialized once you call a function of the websocket class. The first thing you should do is set the error [emitter](https://nodejs.org/api/events.html#events_class_eventemitter). To receive responses on the websocket the emitter should also be set per called function. The emitter is initialized automatically and can be retrieved through the `bitvavo.getEmitter()` function. After which you should set the emitter key to the function name (camelCase). This means that if you call the time function, the emitter should be set in the following manner:

```javascript
let emitter = bitvavo.getEmitter()

emitter.on('error', (response) => {
  console.log('Handle errors here', response)
})

emitter.on('time', (response) => {
  console.log('Handle your response here', response)
})

bitvavo.websocket.time()
```

The api key and secret are copied from the bitvavo object. Therefore if you want to use the private portion of the websockets API, you should set both the key and secret as specified in [REST requests](#rest-requests).

### Public

#### Get time
```javascript
bitvavo.getEmitter().on('time', (response) => {
  console.log(response)
})

bitvavo.websocket.time()
```
<details>
 <summary>View Response</summary>

```javascript
{ time: 1543478503490 }
```
</details>

#### Get markets
```javascript
bitvavo.getEmitter().on('markets', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.markets({})
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ADA-BTC',
  status: 'trading',
  base: 'ADA',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '100',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'ADA-EUR',
  status: 'trading',
  base: 'ADA',
  quote: 'EUR',
  pricePrecision: 5,
  minOrderInBaseAsset: '100',
  minOrderInQuoteAsset: '10',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AE-BTC',
  status: 'trading',
  base: 'AE',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '10',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AE-EUR',
  status: 'trading',
  base: 'AE',
  quote: 'EUR',
  pricePrecision: 5,
  minOrderInBaseAsset: '10',
  minOrderInQuoteAsset: '10',
  orderTypes: [ 'market', 'limit' ] }
{ market: 'AION-BTC',
  status: 'trading',
  base: 'AION',
  quote: 'BTC',
  pricePrecision: 5,
  minOrderInBaseAsset: '30',
  minOrderInQuoteAsset: '0.001',
  orderTypes: [ 'market', 'limit' ] }
  ...
```
</details>

#### Get assets
```javascript
bitvavo.getEmitter().on('assets', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: symbol
bitvavo.websocket.assets({})
```
<details>
 <summary>View Response</summary>

```javascript
{ symbol: 'ADA',
  name: 'Cardano',
  decimals: 6,
  depositFee: '0',
  depositConfirmations: 0,
  depositStatus: 'OK',
  withdrawalFee: '0.2',
  withdrawalMinAmount: '0.2',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BAT',
  name: 'Basic Attention Token',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 0,
  depositStatus: 'OK',
  withdrawalFee: '7',
  withdrawalMinAmount: '7',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BCH',
  name: 'Bitcoin Cash',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 0,
  depositStatus: 'OK',
  withdrawalFee: '0.0001',
  withdrawalMinAmount: '0.00001',
  withdrawalStatus: 'OK',
  message: '' }
{ symbol: 'BTC',
  name: 'Bitcoin',
  decimals: 8,
  depositFee: '0',
  depositConfirmations: 0,
  depositStatus: 'OK',
  withdrawalFee: '0.00006',
  withdrawalMinAmount: '0.00001',
  withdrawalStatus: 'OK',
  message: '' }
  ...  
```
</details>

#### Get book per market
```javascript
bitvavo.getEmitter().on('book', (response) => {
  console.log(response)
})

// options: depth
bitvavo.websocket.book('BTC-EUR', {})
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'BTC-EUR',
  nonce: 39785,
  bids:
   [ [ '3304', '0.00303' ],
     [ '3297.2', '0.0030344' ],
     [ '3290.2', '0.00304085' ],
     [ '3283.9', '0.00304669' ],
     [ '3277.6', '0.00305254' ],
     [ '3269.5', '0.00306011' ],
     [ '3262.9', '0.0030663' ],
     [ '3256.5', '0.00307232' ],
     [ '3249.7', '0.00307875' ],
     [ '3243', '0.00308511' ],
     [ '3236.4', '0.0030914' ],
     [ '3229.8', '0.00309772' ],
     [ '3224.1', '0.0031032' ],
     [ '3217.5', '0.00310956' ],
     [ '3210', '0.00311683' ],
     [ '3203.4', '0.00312325' ],
     [ '3197.7', '0.00312882' ],
     [ '3186.3', '0.00314001' ],
     [ '3182.3', '0.00314396' ],
     [ '3177.7', '0.00314851' ],
     [ '3166.6', '0.00315955' ],
     [ '3160', '0.00316614' ],
     [ '3153.4', '0.00317277' ],
     [ '3146.8', '0.00317943' ],
     [ '3138.7', '0.00318763' ] ],
  asks:
   [ [ '3310.7', '0.00302503' ],
     [ '3317.4', '0.00302494' ],
     [ '3324.1', '0.00302494' ],
     [ '3330.7', '0.00302494' ],
     [ '3337.3', '0.00302494' ],
     [ '3343.9', '0.00302494' ],
     [ '3350.5', '0.00302494' ],
     [ '3357.1', '0.00302503' ],
     [ '3366.3', '0.00302266' ],
     [ '3372.9', '0.00302266' ],
     [ '3379.6', '0.00302266' ],
     [ '3386.2', '0.00302266' ],
     [ '3392.8', '0.00302266' ],
     [ '3399.5', '0.00302266' ],
     [ '3401.3', '0.00302687' ],
     [ '3408', '0.00302687' ],
     [ '3414.4', '0.00302705' ],
     [ '3420.8', '0.00302723' ],
     [ '3427', '0.0030276' ],
     [ '3433.3', '0.00302787' ],
     [ '3439.1', '0.00302861' ],
     [ '3445.7', '0.00302861' ],
     [ '3451.9', '0.00302897' ],
     [ '3458.2', '0.00302925' ],
     [ '3464.3', '0.00302971' ],
     [ '3500.1', '0.002032' ] ] }
```
</details>

#### Get trades per market
```javascript
bitvavo.getEmitter().on('publicTrades', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: limit, start, end, tradeId
bitvavo.websocket.publicTrades('BTC-EUR', {})
```
<details>
 <summary>View Response</summary>

```javascript
{ id: '5400feff-54b8-40a3-90d4-5f0f68f28c25',
  timestamp: 1545213249947,
  amount: '0.001',
  price: '3500.1',
  side: 'buy' }
{ id: '0294c35a-c2d3-41b3-9f6d-759312c51e8d',
  timestamp: 1545213234550,
  amount: '0.003039',
  price: '3453.7',
  side: 'buy' }
{ id: '3501ca58-3980-4797-bccc-70fd58405c96',
  timestamp: 1545213234535,
  amount: '0.003039',
  price: '3447.1',
  side: 'buy' }
{ id: '6ac6944d-870c-466d-bec3-f03d1cc43409',
  timestamp: 1545213234521,
  amount: '0.00303191',
  price: '3441.9',
  side: 'buy' }
{ id: 'f79a2d5d-4839-4191-b0b3-65044bb4861d',
  timestamp: 1545213234508,
  amount: '0.003039',
  price: '3440.5',
  side: 'buy' }
{ id: '8a5cf6c5-d802-4f05-a6bc-63e0ad79423a',
  timestamp: 1545213234491,
  amount: '0.00303568',
  price: '3431.1',
  side: 'buy' }
{ id: '896c451f-a5f2-4b77-80d0-5b095a90d139',
  timestamp: 1545213234479,
  amount: '0.00303568',
  price: '3424.5',
  side: 'buy' }
{ id: '300bc05a-f63a-4ad2-ba87-b7b3900a4ed9',
  timestamp: 1545213234458,
  amount: '0.00303375',
  price: '3420',
  side: 'buy' }
  ...
```
</details>

#### Get candles per market
```javascript
bitvavo.getEmitter().on('candles', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: limit, start, end
bitvavo.websocket.candles('BTC-EUR', '1h', {})
```
<details>
 <summary>View Response</summary>

```javascript
[ 1545210000000, '3308.2', '3500.1', '3308.2', '3500.1', '0.07684055' ]
[ 1545138000000, '3158.2', '3199.6', '3158.2', '3199.6', '0.02477561' ]
[ 1545134400000, '3154.8', '3158.2', '3154.8', '3158.2', '0.003' ]
[ 1545130800000, '3154.8', '3154.8', '3154.8', '3154.8', '0.001' ]
[ 1545210000000, '3308.2', '3500.1', '3308.2', '3500.1', '0.07684055' ]
[ 1545138000000, '3158.2', '3199.6', '3158.2', '3199.6', '0.02477561' ]
[ 1545134400000, '3154.8', '3158.2', '3154.8', '3158.2', '0.003' ]
[ 1545130800000, '3154.8', '3154.8', '3154.8', '3154.8', '0.001' ]
 ...
```
</details>

#### Get price ticker
```javascript
bitvavo.getEmitter().on('tickerPrice', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.tickerPrice({})
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'XRP-BTC', price: '0.000097983' }
{ market: 'MIOTA-BTC', price: '0.000078189' }
{ market: 'LSK-BTC', price: '0.00034486' }
{ market: 'BCH-EUR', price: '102.1' }
{ market: 'XRP-EUR', price: '0.32418' }
{ market: 'AE-BTC', price: '0.00011033' }
{ market: 'AION-BTC', price: '0.000034426' }
{ market: 'ANT-BTC', price: '0.00011455' }
{ market: 'ARK-BTC', price: '0.00009624' }
{ market: 'BAT-BTC', price: '0.000037708' }
{ market: 'BTC-EUR', price: '3500.1' }
{ market: 'CMT-BTC', price: '0.000006695' }
{ market: 'DCR-BTC', price: '0.0048841' }
{ market: 'DGB-BTC', price: '0.0000030977' }
{ market: 'ELF-EUR', price: '0.10219' }
{ market: 'EOS-BTC', price: '0.00068749' }
{ market: 'ETC-BTC', price: '0.0011361' }
{ market: 'ETH-BTC', price: '0.027504' }
{ market: 'GAS-BTC', price: '0.0005364' }
{ market: 'GNT-BTC', price: '0.000018384' }
{ market: 'ICX-EUR', price: '0.17683' }
{ market: 'LRC-BTC', price: '0.000011178' }
{ market: 'LTC-EUR', price: '24.622' }
{ market: 'NANO-BTC', price: '0.00025949' }
{ market: 'NAS-EUR', price: '0.46102' }
{ market: 'NEO-BTC', price: '0.0018661' }
{ market: 'NEO-EUR', price: '5.6134' }
{ market: 'OMG-BTC', price: '0.000365' }
{ market: 'ONT-BTC', price: '0.00018014' }
{ market: 'ONT-EUR', price: '0.48529' }
{ market: 'POWR-BTC', price: '0.000020786' }
{ market: 'POWR-EUR', price: '0.068639' }
{ market: 'QTUM-EUR', price: '1.9927' }
{ market: 'RDD-EUR', price: '0.0011917' }
...
```
</details>

#### Get book ticker
```javascript
bitvavo.getEmitter().on('tickerBook', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.tickerBook({})
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ANT-EUR', bid: '0.37294', ask: '0.3782' }
{ market: 'AION-EUR', bid: '0.11375', ask: '0.11376' }
{ market: 'AE-EUR', bid: '0.36224', ask: '0.36508' }
{ market: 'DGB-EUR', bid: '0.010111', ask: '0.010237' }
{ market: 'CMT-EUR', bid: '0.021978', ask: '0.022123' }
{ market: 'BCH-EUR', bid: '100.81', ask: '101.73' }
{ market: 'ADA-EUR', bid: '0.031411', ask: '0.031415' }
{ market: 'ARK-EUR', bid: '0.31809', ask: '0.3181' }
{ market: 'GAS-EUR', bid: '1.7675', ask: '1.7725' }
{ market: 'BAT-EUR', bid: '0.12456', ask: '0.1246' }
{ market: 'DCR-EUR', bid: '16.018', ask: '16.108' }
{ market: 'MIOTA-EUR', bid: '0.25656', ask: '0.25846' }
{ market: 'ETH-EUR', bid: '89.987', ask: '89.988' }
{ market: 'RDD-EUR', bid: '0.0011564', ask: '0.0011917' }
{ market: 'ETC-EUR', bid: '3.7418', ask: '3.7483' }
{ market: 'NANO-EUR', bid: '0.85528', ask: '0.8575' }
{ market: 'GNT-EUR', bid: '0.059622', ask: '0.060773' }
{ market: 'ONT-EUR', bid: '0.58367', ask: '0.60012' }
{ market: 'LSK-EUR', bid: '1.2082', ask: '1.2502' }
{ market: 'VTC-EUR', bid: '0.23109', ask: '0.23318' }
{ market: 'OMG-EUR', bid: '1.1963', ask: '1.2042' }
{ market: 'NEO-EUR', bid: '6.1506', ask: '6.1699' }
{ market: 'SUB-EUR', bid: '0.04089', ask: '0.041101' }
{ market: 'QTUM-EUR', bid: '1.9849', ask: '1.9927' }
{ market: 'STORM-EUR', bid: '0.0027308', ask: '0.0027623' }
{ market: 'SNT-EUR', bid: '0.014299', ask: '0.014444' }
{ market: 'VET-EUR', bid: '0.003674', ask: '0.0037079' }
{ market: 'STEEM-EUR', bid: '0.23534', ask: '0.23579' }
{ market: 'XEM-EUR', bid: '0.059711', ask: '0.060419' }
{ market: 'POWR-EUR', bid: '0.068482', ask: '0.068639' }
{ market: 'ANT-BTC', bid: '0.00011259', ask: '0.00011441' }
{ market: 'WTC-EUR', bid: '0.97266', ask: '0.97931' }
{ market: 'ELF-EUR', bid: '0.10122', ask: '0.10219' }
{ market: 'XLM-EUR', bid: '0.104', ask: '0.10414' }
{ market: 'NAS-EUR', bid: '0.54514', ask: '0.54577' }
{ market: 'AE-BTC', bid: '0.00010942', ask: '0.00011033' }
{ market: 'ICX-EUR', bid: '0.19765', ask: '0.19916' }
{ market: 'ZIL-EUR', bid: '0.014306', ask: '0.014379' }
{ market: 'AION-BTC', bid: '0.000034374', ask: '0.000034426' }
...
```
</details>

#### Get 24 hour ticker
```javascript
bitvavo.getEmitter().on('ticker24h', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.ticker24h({})
```
<details>
 <summary>View Response</summary>

```javascript
{ market: 'ADA-BTC',
  open: '0.0000095071',
  high: '0.0000095071',
  low: '0.0000095071',
  last: '0.0000095071',
  volume: '1',
  volumeQuote: '0.00000951' }
{ market: 'ADA-EUR',
  open: '0.031415',
  high: '0.031415',
  low: '0.031415',
  last: '0.031415',
  volume: '1',
  volumeQuote: '0.03' }
{ market: 'AE-BTC',
  open: '0.00011033',
  high: '0.00011033',
  low: '0.00011033',
  last: '0.00011033',
  volume: '1',
  volumeQuote: '0.00011033' }
{ market: 'AE-EUR',
  open: '0.36508',
  high: '0.36508',
  low: '0.36508',
  last: '0.36508',
  volume: '1',
  volumeQuote: '0.37' }
{ market: 'AION-BTC',
  open: '0.000034426',
  high: '0.000034426',
  low: '0.000034426',
  last: '0.000034426',
  volume: '1',
  volumeQuote: '0.00003443' }
{ market: 'AION-EUR',
  open: '0.11376',
  high: '0.11376',
  low: '0.11376',
  last: '0.11376',
  volume: '1',
  volumeQuote: '0.11' }
{ market: 'ANT-BTC',
  open: '0.00011455',
  high: '0.00011455',
  low: '0.00011455',
  last: '0.00011455',
  volume: '1',
  volumeQuote: '0.00011455' }
{ market: 'ANT-EUR',
  open: '0.3785',
  high: '0.3785',
  low: '0.3785',
  last: '0.3785',
  volume: '1',
  volumeQuote: '0.38' }
{ market: 'ARK-BTC',
  open: '0.00009624',
  high: '0.00009624',
  low: '0.00009624',
  last: '0.00009624',
  volume: '1',
  volumeQuote: '0.00009624' }
{ market: 'ARK-EUR',
  open: '0.3181',
  high: '0.3181',
  low: '0.3181',
  last: '0.3181',
  volume: '1',
  volumeQuote: '0.32' }
{ market: 'BAT-BTC',
  open: '0.000037708',
  high: '0.000037708',
  low: '0.000037708',
  last: '0.000037708',
  volume: '1',
  volumeQuote: '0.00003771' }
...
```
</details>

### Private

#### Place order
When placing an order, make sure that the correct optional parameters are set. For a limit order it is required to set both the amount and price. A market order is valid if either the amount or the amountQuote has been set.
```javascript
bitvavo.getEmitter().on('placeOrder', (response) => {
  console.log(response)
})

// Optional parameters: limit:(amount, price, postOnly), market:(amount, amountQuote, disableMarketProtection),
// both: timeInForce, selfTradePrevention, responseRequired
bitvavo.websocket.placeOrder('BTC-EUR', 'buy', 'limit', { amount: 0.1, price: 5000 })
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092',
  market: 'BTC-EUR',
  created: 1543482451221,
  updated: 1543482451221,
  status: 'new',
  side: 'sell',
  orderType: 'limit',
  amount: '0.1',
  price: '5000',
  onHold: '0.1',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Update order
When updating an order make sure that at least one of the optional parameters has been set. Otherwise nothing can be updated.
```javascript
bitvavo.getEmitter().on('updateOrder', (response) => {
  console.log(response)
})

// Optional parameters: limit:(amount, amountRemaining, price, timeInForce, selfTradePrevention, postOnly)
// (set at least 1) (responseRequired can be set as well, but does not update anything)
bitvavo.websocket.updateOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092', { amount: '0.2' })
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092',
  market: 'BTC-EUR',
  created: 1543482451221,
  updated: 1543482646215,
  status: 'new',
  side: 'sell',
  orderType: 'limit',
  amount: '0.2',
  price: '5000',
  onHold: '0.2',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Get order
```javascript
bitvavo.getEmitter().on('getOrder', (response) => {
  console.log(response)
})

bitvavo.websocket.getOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092')
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092',
  market: 'BTC-EUR',
  created: 1543482451221,
  updated: 1543482646215,
  status: 'new',
  side: 'sell',
  orderType: 'limit',
  amount: '0.2',
  price: '5000',
  onHold: '0.2',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Cancel order
```javascript
bitvavo.getEmitter().on('cancelOrder', (response) => {
  console.log(response)
})

bitvavo.websocket.cancelOrder('BTC-EUR', 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092')
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092' }
```
</details>

#### Get orders
Returns the same as get order, but can be used to return multiple orders at once.
```javascript
bitvavo.getEmitter().on('getOrders', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: orderId, limit, start, end
bitvavo.websocket.getOrders('BTC-EUR', {})
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '99e9a45b-26c8-4079-9da2-f0f42e008edb',
  market: 'BTC-EUR',
  created: 1543482451253,
  updated: 1543482902905,
  status: 'canceled',
  side: 'sell',
  orderType: 'limit',
  amount: '0.1',
  price: '5000',
  onHold: '0',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: false,
  timeInForce: 'GTC',
  postOnly: false }
{ orderId: 'bb4076a3-d7b6-4bf6-aa35-b12f14fcb092',
  market: 'BTC-EUR',
  created: 1543482451221,
  updated: 1543482902930,
  status: 'canceled',
  side: 'sell',
  orderType: 'limit',
  amount: '0.2',
  price: '5000',
  onHold: '0',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: false,
  timeInForce: 'GTC',
  postOnly: false }
{ orderId: 'baf3eca0-36c1-41c9-b21f-8f46e45f9ff5',
  market: 'BTC-EUR',
  created: 1543229981645,
  updated: 1543229993276,
  status: 'canceled',
  side: 'sell',
  orderType: 'limit',
  amount: '0.1',
  price: '5000',
  onHold: '0',
  onHoldCurrency: 'BTC',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: false,
  timeInForce: 'GTC',
  postOnly: false }
  ...
```
</details>

#### Cancel orders
Cancels all orders in a market. If no market is specified, all orders of an account will be canceled.
```javascript
bitvavo.getEmitter().on('cancelOrders', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.cancelOrders({})
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '7e7a20ce-44f2-401c-aaca-64f36e6f3e09' }
{ orderId: '35f17a0c-3344-452c-b348-20f3424574b8' }
...
```
</details>

#### Get orders open
Returns all orders which are not filled or canceled.
```javascript
bitvavo.getEmitter().on('ordersOpen', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: market
bitvavo.websocket.ordersOpen({})
```
<details>
 <summary>View Response</summary>

```javascript
{ orderId: '96cd3157-a6cb-4d7f-9a1d-8041c29dc982',
  market: 'BTC-EUR',
  created: 1545216249448,
  updated: 1545216249448,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '0.1',
  price: '2900',
  onHold: '290.73',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
{ orderId: 'd74440fa-f5d2-48f6-b279-933d84442a8e',
  market: 'BTC-EUR',
  created: 1545216266588,
  updated: 1545216266588,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '0.1',
  price: '2950',
  onHold: '295.74',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
{ orderId: 'f9f4e3b2-de48-4f55-8c98-23fe39f20806',
  market: 'BTC-EUR',
  created: 1545216276974,
  updated: 1545216276974,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '0.3',
  price: '2910',
  onHold: '875.19',
  onHoldCurrency: 'EUR',
  filledAmount: '0',
  filledPrice: '0',
  feePaid: '0',
  feeCurrency: 'EUR',
  fills: [],
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
...
```
</details>

#### Get trades
Returns all trades within a market for this account.
```javascript
bitvavo.getEmitter().on('trades', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: limit, start, end, tradeId
bitvavo.websocket.trades('BTC-EUR', {})
```
<details>
 <summary>View Response</summary>

```javascript
{ timestamp: 1545213249947,
  market: 'BTC-EUR',
  side: 'buy',
  amount: '0.001',
  price: '3500.1',
  taker: true,
  fee: '0.0099',
  feeCurrency: 'EUR',
  settled: true }
{ timestamp: 1545213234550,
  market: 'BTC-EUR',
  side: 'buy',
  amount: '0.003039',
  price: '3453.7',
  taker: true,
  fee: '0.0242057',
  feeCurrency: 'EUR',
  settled: true }
{ timestamp: 1545213234535,
  market: 'BTC-EUR',
  side: 'buy',
  amount: '0.003039',
  price: '3447.1',
  taker: true,
  fee: '0.0342631',
  feeCurrency: 'EUR',
  settled: true }
{ timestamp: 1545213234521,
  market: 'BTC-EUR',
  side: 'buy',
  amount: '0.00303191',
  price: '3441.9',
  taker: true,
  fee: '0.024468971',
  feeCurrency: 'EUR',
  settled: true }
{ timestamp: 1545213234508,
  market: 'BTC-EUR',
  side: 'buy',
  amount: '0.003039',
  price: '3440.5',
  taker: true,
  fee: '0.0243205',
  feeCurrency: 'EUR',
  settled: true }
...
```
</details>

#### Get balance
Returns the balance for this account.
```javascript
bitvavo.getEmitter().on('balance', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: symbol
bitvavo.websocket.balance({})
```
<details>
 <summary>View Response</summary>

```javascript
{ symbol: 'EUR', available: '1179.28', inOrder: '17738.27' }
{ symbol: 'BTC', available: '3.99704969', inOrder: '0' }
{ symbol: 'ADA', available: '123.1', inOrder: '0' }
{ symbol: 'BCH', available: '3.99704969', inOrder: '0' }
{ symbol: 'BSV', available: '3.99704969', inOrder: '0' }
{ symbol: 'DASH', available: '53', inOrder: '0' }
{ symbol: 'EOS', available: '79.267', inOrder: '1.3562' }
{ symbol: 'ETH', available: '45.435', inOrder: '0' }
{ symbol: 'LTC', available: '10', inOrder: '0' }
{ symbol: 'NEO', available: '243.4', inOrder: '0' }
{ symbol: 'QTUM', available: '13', inOrder: '0' }
{ symbol: 'TRX', available: '45', inOrder: '0' }
{ symbol: 'XEM', available: '34.43', inOrder: '0' }
{ symbol: 'XLM', available: '324', inOrder: '0' }
...
```
</details>

#### Deposit assets
Returns the address which can be used to deposit funds.
```javascript
bitvavo.getEmitter().on('depositAssets', (response) => {
  console.log(response)
})

bitvavo.websocket.depositAssets('BTC')
```
<details>
 <summary>View Response</summary>

```javascript
{ address: 'BitcoinAddress'}
```
</details>

#### Withdraw assets
Can be used to withdraw funds from Bitvavo.
```javascript
bitvavo.getEmitter().on('withdrawAssets', (response) => {
  console.log(response)
})

// Optional parameters: paymentId, internal, addWithdrawalFee
bitvavo.websocket.withdrawAssets('BTC', 1, 'BitcoinAddress', {})
```
<details>
 <summary>View Response</summary>

```javascript
{ success: true, symbol: 'BTC', amount: '1' }
```
</details>

#### Get deposit history
Returns the deposit history of your account.
```javascript
bitvavo.getEmitter().on('depositHistory', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: symbol, limit, start, end
bitvavo.websocket.depositHistory({})
```
<details>
 <summary>View Response</summary>

```javascript
{ timestamp: 1545226978000,
  symbol: 'BTC',
  amount: '1.35',
  address: '',
  paymentId: '',
  txId: '387a2cd34ac0dcaf0b63d374e703e227f39984808d52951c81283f23ea107088',
  fee: '0',
  status: 'completed' }
{ timestamp: 1545226940000,
  symbol: 'XRP',
  amount: '121.11',
  address: '',
  paymentId: '',
  txId: 'EAB486A626819D87C848AA46F6B0B3C4B944D0304F5C7FA6D7D31DBDD7C662EA',
  fee: '0',
  status: 'completed' }
  ...
```
</details>

#### Get withdrawal history
Returns the withdrawal history of an account.
```javascript
bitvavo.getEmitter().on('withdrawalHistory', (response) => {
  for (let entry of response) {
    console.log(entry)
  }
})

// options: symbol, limit, start, end
bitvavo.websocket.withdrawalHistory({})
```
<details>
 <summary>View Response</summary>

```javascript
{ timestamp: 1543485186000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485186000,
  symbol: 'BTC',
  amount: '1.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485176000,
  symbol: 'BTC',
  amount: '1.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543485175000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
{ timestamp: 1543400914000,
  symbol: 'BTC',
  amount: '0.99994',
  address: 'BitcoinAddress',
  paymentId: '',
  txId: '',
  fee: '0.00006',
  status: 'awaiting_processing' }
  ...
```
</details>

### Subscriptions

For subscriptions callbacks are used instead of the emitter. This is because you can subscribe to the same function, but with different markets/intervals. Callbacks enable you to handle responses differently per market for the same function. Be aware that when you call the same function with the same market (and in the case of candles with the same interval), your older callback will be overwritten. Errors will still be emitted and should be caught in the following manner: `emitter.on('error', (error) => {
    console.log('Handle your error here', error)
  })`

#### Ticker subscription
Sends an update every time the best bid, best ask or last price changed.
```javascript
bitvavo.websocket.subscriptionTicker('BTC-EUR', (response) => {
  console.log(response)
})
```
<details>
 <summary>View Response</summary>

```javascript
{ event: 'ticker', market: 'BTC-EUR', bestAsk: '3376.2' }
```
</details>

#### Account subscription
Sends an update whenever an event happens which is related to the account. These are ‘order’ events (create, update, cancel) or ‘fill’ events (a trade occurred).
```javascript
bitvavo.websocket.subscriptionAccount('BTC-EUR', (response) => {
  console.log(response)
})
```
<details>
 <summary>View Response</summary>

```javascript
Fill:
{ event: 'fill',
  timestamp: 1545220667936,
  market: 'BTC-EUR',
  orderId: '6a830458-c886-407b-b076-d7103de5ce74',
  fillId: '15d14b09-389d-4f83-9413-de9d0d8e7715',
  side: 'buy',
  amount: '0.00296444',
  price: '3540.5',
  taker: true,
  fee: '0.02440018',
  feeCurrency: 'EUR' }

Order (limit):
{ event: 'order',
  orderId: '2f7d49bc-c3e2-4ea0-9e4f-999bb2148591',
  market: 'BTC-EUR',
  created: 1545220585343,
  updated: 1545220585343,
  status: 'new',
  side: 'buy',
  orderType: 'limit',
  amount: '0.3',
  amountRemaining: '0.3',
  price: '2910',
  onHold: '875.19',
  onHoldCurrency: 'EUR',
  selfTradePrevention: 'decrementAndCancel',
  visible: true,
  timeInForce: 'GTC',
  postOnly: false }
```
</details>

#### Candles subscription
Sends an updated candle after each trade for the specified interval and market.
```javascript
bitvavo.websocket.subscriptionCandles('BTC-EUR', '1h', (response) => {
  console.log(response)
})
```
<details>
 <summary>View Response</summary>

```javascript
{ event: 'candle',
  market: 'BTC-EUR',
  interval: '1h',
  candle:
   [ [ 1545217200000,
       '3377.7',
       '3384.4',
       '3377.7',
       '3384.4',
       '0.00593012' ] ] }
```
</details>

#### Trades subscription
Sends an update whenever a trade has happened on this market. For your own trades, please subscribe to account.
```javascript
bitvavo.websocket.subscriptionTrades('BTC-EUR', (response) => {
  console.log(response)
})
```
<details>
 <summary>View Response</summary>

```javascript
{ event: 'trade',
  timestamp: 1545220667509,
  market: 'BTC-EUR',
  id: '7609c9b7-cb50-45d4-bf11-ce0451e2f073',
  amount: '0.00296506',
  price: '3377.7',
  side: 'buy' }
```
</details>

#### Book subscription
Sends an update whenever the order book for this specific market has changed. A list of tuples ([price, amount]) are returned, where amount ‘0’ means that there are no more orders at this price. If you wish to maintain your own copy of the order book, consider using the next function.
```javascript
bitvavo.websocket.subscriptionBookUpdate('BTC-EUR', (response) => {
  console.log(response)
})
```
<details>
 <summary>View Response</summary>

```javascript
{ event: 'book',
  market: 'BTC-EUR',
  nonce: 41186,
  bids: [ [ '3344.5', '0' ], [ '3345.7', '0.00299041' ] ],
  asks: [] }
```
</details>

#### Book subscription with local copy
This is a combination of get book per market and the book subscription which maintains a local copy. On every update to the order book, the entire order book is returned to the callback, while the book subscription will only return updates to the book.
```javascript
bitvavo.websocket.subscriptionBook('LTC-EUR', (book) => {
  console.log(book)
})
```
<details>
 <summary>View Response</summary>

```javascript
{ bids:
   [ [ '3365.2', '0.00297308' ],
     [ '3358.5', '0.00297901' ],
     [ '3351.3', '0.00298541' ],
     [ '3344.5', '0.00299148' ],
     [ '3337.4', '0.00299785' ],
     [ '3331.1', '0.00300352' ],
     [ '3324', '0.00300993' ],
     [ '3318.8', '0.00301465' ],
     [ '3312.1', '0.00302075' ],
     [ '3305.3', '0.00302696' ],
     [ '3297.4', '0.00303421' ],
     [ '3290.7', '0.00304039' ],
     [ '3284', '0.00304659' ],
     [ '3276.9', '0.0030532' ],
     [ '3275.1', '0.00305487' ],
     [ '3268.3', '0.00306123' ],
     [ '3261.6', '0.00306752' ],
     [ '3254.9', '0.00307383' ],
     [ '3248.1', '0.00308027' ],
     [ '3241.4', '0.00308663' ],
     [ '3234.7', '0.00309303' ],
     [ '3227.9', '0.00309954' ],
     [ '3221.2', '0.00310599' ],
     [ '3214.4', '0.00311256' ],
     [ '3207.7', '0.00311906' ],
     [ '2950', '0.1' ],
     [ '2910', '0.3' ],
     [ '2900', '0.1' ] ],
  asks:
   [ [ '3373.1', '0.00296911' ],
     [ '3380', '0.00296893' ],
     [ '3386.6', '0.00296911' ],
     [ '3394.1', '0.0029684' ],
     [ '3400.9', '0.0029684' ],
     [ '3407.6', '0.0029684' ],
     [ '3414.4', '0.0029684' ],
     [ '3421.1', '0.0029684' ],
     [ '3427.9', '0.0029684' ],
     [ '3434.6', '0.0029684' ],
     [ '3441.3', '0.0029684' ],
     [ '3448.1', '0.0029684' ],
     [ '3454.8', '0.0029684' ],
     [ '3460.7', '0.0029692' ],
     [ '3467.4', '0.0029692' ],
     [ '3473.7', '0.00296955' ],
     [ '3479.7', '0.00297025' ],
     [ '3486.4', '0.00297025' ],
     [ '3500', '0.00296444' ],
     [ '3506.8', '0.00296444' ],
     [ '3513.5', '0.00296444' ],
     [ '3520.3', '0.00296444' ],
     [ '3527', '0.00296444' ],
     [ '3533.8', '0.00296444' ],
     [ '3540.5', '0.00296444' ] ],
  nonce: 41175 }
```
</details>