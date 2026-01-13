[![Build Status](https://travis-ci.org/Vexanium/vexaniumjs.svg?branch=master)](https://travis-ci.org/Vexanium/vexaniumjs)
[![NPM](https://img.shields.io/npm/v/vexaniumjs.svg)](https://www.npmjs.org/package/vexaniumjs)

# Vexaniumjs

General purpose library for Vexanium blockchains.

### Versions

| [Vexanium/vexaniumjs](/Vexanium/vexaniumjs) | [Npm](https://www.npmjs.com/package/vexaniumjs) | [Vexanium/vex](https://github.com/Vexanium/vex) | [Docker Hub](https://hub.docker.com/r/vexio/vex/) |
| --- | --- | --- | --- |
| tags: 16.0.0 - 16.0.9 | `npm install vexaniumjs` | tags: v1.1.n - v1.2.4 | vexio/vex:v1.2.4 |

Prior [version](./docs/prior_versions.md) matrix.

### Usage

* Install with: `npm install vexaniumjs`
* Html script tag, see [releases](https://github.com/Vexanium/vexaniumjs/releases) for the correct **version** and its matching script **integrity** hash.

```html
<!--
sha512-fqmNgLjSEhMSiGW9Tkv735UpvnPPKlaVOHgYwrOEhzRbzcsB5z7g2zHYtAOKgIOYNkGg3Q3CBfJapbVU9lzbpA== lib/vex.js
sha512-zhPSKFEBlDVvUzjl9aBS66cI8tDYoLetynuKvIekHT8NZZ12oxwcZ//M/eT/2Rb/pR/cjFvLD8104Cy//sdEnA== lib/vex.min.js
sha512-VKOxq8R14PpPh4nbLvD8DtxxTv1UmZp7pb3+P8IOQ36m3PBJpm6cd8pI8WRI6d9/aozwADKb3HSFQ7A8s+OhSA== lib/vex.min.js.map
-->
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/vexaniumjs@16.0.9/lib/vex.min.js"
    integrity="sha512-zhPSKFEBlDVvUzjl9aBS66cI8tDYoLetynuKvIekHT8NZZ12oxwcZ//M/eT/2Rb/pR/cjFvLD8104Cy//sdEnA=="
    crossorigin="anonymous"></script>

  <script>
  /** Transactions are only valid on the selected chain. */
  chain = {
    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
    jungle: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca', // jungle testnet
    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // local developer
  }

  /**
    Other httpEndpoint's: https://www.Vexdocs.io/resources/apiendpoints
  */
  vex = Vex({
    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',// private key
    httpEndpoint: 'http://127.0.0.1:8888',
    chainId: chain.sys,
  });

  /**
    Sign and broadcast a transaction.

    @example updateProducerVote('myaccount', 'proxyaccount', ['respectedbp'])
  */
  async function updateProducerVote(voter, proxy = '', producers = []) {
    return vex.voteproducer(voter, proxy, producers)
  }

  </script>
</head>
</html>
```

### Usage

Ways to instantiate vexaniumjs.

```js
Vex = require('vexaniumjs')

// Private key or keys (array) provided statically or by way of a function.
// For multiple keys, the get_required_keys API is used (more on that below).
keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'

// Localhost Testnet (run ./docker/up.sh)
vex = Vex({keyProvider})

// Connect to a testnet or mainnet
vex = Vex({httpEndpoint, chainId, keyProvider})

// Cold-storage
vex = Vex({httpEndpoint: null, chainId, keyProvider})

// Add support for non-VEX public key prefixes, such as PUB, etc
vex = Vex({keyPrefix: 'PUB'})

// Read-only instance when 'vexaniumjs' is already a dependency
vex = Vex.modules.api({/*config*/})

// Read-only instance when an application never needs to write (smaller library)
VexApi = require('vexaniumjs-api')
vex = VexApi({/*config*/})
```

No-arguments prints usage.

```js
vex.getBlock()
```
```json
USAGE
getBlock - Fetch a block from the blockchain.

PARAMETERS
{
  "block_num_or_id": "string"
}
```

Start a nodVexd process.  The docker in this repository provides a setup
that supports the examples in this README.

```bash
cd ./docker && ./up.sh
```

All blockchain functions (read and write) follow this pattern:

```js
// If the last argument is a function it is treated as a callback
vex.getBlock(1, (error, result) => {})

// If a callback is not provided, a Promise is returned
vex.getBlock(1) // @returns {Promise}

// Parameters can be positional or an object
vex.getBlock({block_num_or_id: 1})

// An API with no parameters is invoked with an empty object or callback (avoids logging usage)
vex.getInfo({}) // @returns {Promise}
vex.getInfo((error, result) => { console.log(error, result) })
```

### API Documentation

Chain and history API functions are available after creating the `vex` object.

* [API](https://github.com/Vexanium/vexaniumjs-api/blob/master/docs/api.md#vex--object)

### Configuration

```js
Vex = require('vexaniumjs')

// Default configuration
config = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: ['PrivateKeys...'], // WIF string or array of keys..
  httpEndpoint: 'http://127.0.0.1:8888',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

vex = Vex(config)
```

* **chainId** `hex` - Unique ID for the blockchain you're connecting to.  This
  is required for valid transaction signing.  The chainId is provided via the
  [get_info](http://ayeaye.cypherglass.com:8888/v1/chain/get_info) API call.

  Identifies a chain by its initial genesis block.  All transactions signed will
  only be valid the blockchain with this chainId.  Verify the chainId for
  security reasons.

* **keyProvider** `[array<string>|string|function]` - Provides private keys
  used to sign transactions.  If multiple private keys are found, the API
  `get_required_keys` is called to discover which signing keys to use.  If a
  function is provided, this function is called for each transaction.

  If a keyProvider is not provided here, one may be provided on a per-action
  or per-transaction basis in [Options](#options).

* **keyPrefix** `[string='VEX']` - Change the public key prefix.

* **httpEndpoint** `string` - http or https location of a nodVexd server
  providing a chain API.  When using vexaniumjs from a browser remember to configure
  the same origin policy in nodVexd or proxy server.  For testing, nodVexd
  configuration `access-control-allow-origin = *` could be used.

  Set this value to **null** for a cold-storage (no network) configuration.

* **expireInSeconds** `number` - number of seconds before the transaction
  will expire.  The time is based on the nodVexd's clock.  An unexpired
  transaction that may have had an error is a liability until the expiration
  is reached, this time should be brief.

* **broadcast** `[boolean=true]` - post the transaction to
  the blockchain.  Use false to obtain a fully signed transaction.

* **verbose** `[boolean=false]` - verbose logging such as API activity.

* **debug** `[boolean=false]` - low level debug logging (serialization).

* **sign** `[boolean=true]` - sign the transaction with a private key.  Leaving
  a transaction unsigned avoids the need to provide a private key.

* **mockTransactions** (advanced)
  * `mockTransactions: () => null // 'pass',  or 'fail'`
  * `pass` - do not broadcast, always pretend that the transaction worked
  * `fail` - do not broadcast, pretend the transaction failed
  * `null|undefined` - broadcast as usual

* **transactionHeaders** (advanced) - manually calculate transaction header.  This
  may be provided so vexaniumjs does not need to make header related API calls to
  nodVex.  Used in environments like cold-storage.  This callback is called for
  every transaction. Headers are documented here [vexaniumjs-api#headers](https://github.com/Vexanium/vexaniumjs-api/blob/HEAD/docs/index.md#headers--object).
  * `transactionHeaders: (expireInSeconds, callback) => {callback(null/*error*/, headers)}`

* **logger** - default logging configuration.
  ```js
  logger: {
    log: config.verbose ? console.log : null,  // null to disable
    error: config.verbose ? console.error : null,
  }
  ```

  For example, redirect error logs: `config.logger = {error: (...args) => ..}`

* **authorization** - replace the default vexaniumjs authorization on actions.  An
  authorization provided here may still be over-written by specifying an
  authorization for each individual action.

  For example, if most actions in an dapp are based on the posting key, this
  would replace the default active authorization with a posting authorization:
  ```js
  {authorization: '@posting'}
  ```

### Options

Options may be provided after parameters.

NOTE: `authorization` is for individual actions, it does not belong in `Vex(config)`.

```js
options = {
  authorization: 'alice@active',
  broadcast: true,
  sign: true
}
```

```js
vex.transfer('alice', 'bob', '1.0000 VEX', '', options)
```

* **authorization** `[array<auth>|auth]` - identifies the
  signing account and permission typically in a multisig
  configuration.  Authorization may be a string formatted as
  `account@permission` or an `object<{actor: account, permission}>`.
  * If missing default authorizations will be calculated.
  * If provided additional authorizations will not be added.
  * Performs deterministic sorting by account name

  If a default authorization is calculated the action's 1st field must be
  an account_name.  The account_name in the 1st field gets added as the
  active key authorization for the action.

* **broadcast** `[boolean=true]` - post the transaction to
  the blockchain.  Use false to obtain a fully signed transaction.

* **sign** `[boolean=true]` - sign the transaction with a private key.  Leaving
  a transaction unsigned avoids the need to provide a private key.

* **keyProvider** `[array<string>|string|function]` - just like the global
  keyProvider except this provides a temporary key for a single action or
  transaction.

  ```js
  await vex.anyAction('args', {keyProvider})
  ```

  ```js
  await vex.transaction(tr => { tr.anyAction() }, {keyProvider})
  ```

### Transaction

The transaction function accepts the standard blockchain transaction.

Required transaction header fields will be added unless you are signing without a
network connection (httpEndpoint == null). In that case provide you own headers:

```js
// only needed in cold-storage or for offline transactions
const headers = {
  expiration: '2018-06-14T18:16:10',
  ref_block_num: 1,
  ref_block_prefix: 452435776
}
```

Create and send (broadcast) a transaction:

```javascript
/** @return {Promise} */
vex.transaction(
  {
    // ...headers,
    // context_free_actions: [],
    actions: [
      {
        account: 'vex.token',
        name: 'transfer',
        authorization: [{
          actor: 'inita',
          permission: 'active'
        }],
        data: {
          from: 'inita',
          to: 'initb',
          quantity: '7.0000 VEX',
          memo: ''
        }
      }
    ]
  }
  // config -- example: {broadcast: false, sign: true}
)
```

### Named action functions

More concise functions are provided for applications that may use actions
more frequently.  This avoids having lots of JSON in the code.

```javascript
// Run with no arguments to print usage.
vex.transfer()

// Callback is last, when omitted a promise is returned
vex.transfer('inita', 'initb', '1.0000 VEX', '', (error, result) => {})
vex.transfer('inita', 'initb', '1.1000 VEX', '') // @returns {Promise}

// positional parameters
vex.transfer('inita', 'initb', '1.2000 VEX', '')

// named parameters
vex.transfer({from: 'inita', to: 'initb', quantity: '1.3000 VEX', memo: ''})

// options appear after parameters
options = {broadcast: true, sign: true}

// `false` is a shortcut for {broadcast: false}
vex.transfer('inita', 'initb', '1.4000 VEX', '', false)
```

Read-write API methods and documentation are generated from the vexio
[token](https://github.com/Vexanium/vexaniumjs/blob/master/src/schema/vex_token.json) and
[system](https://github.com/Vexanium/vexaniumjs/blob/master/src/schema/vex_system.json).

Assets amounts require zero padding.  For a better user-experience, if you know
the correct precision you may use DecimalPad to add the padding.

```js
DecimalPad = Vex.modules.format.DecimalPad
userInput = '10.2'
precision = 4
assert.equal('10.2000', DecimalPad(userInput, precision))
```

For more advanced signing, see `keyProvider` and `signProvider` in
[index.test.js](https://github.com/Vexanium/vexaniumjs/blob/master/src/index.test.js).

### Shorthand

Shorthand is available for some types such as Asset and Authority.  This syntax
is only for concise functions and does not work when providing entire transaction
objects to `vex.transaction`..

For example:
* permission `inita` defaults `inita@active`
* authority `'VEX6MRy..'` expands `{threshold: 1, keys: [{key: 'VEX6MRy..', weight: 1}]}`
* authority `inita` expands `{threshold: 1, accounts: [{permission: {actor: 'inita', permission: 'active'}, weight: 1}]}`

### New Account

New accounts will likely require some staked tokens for RAM and bandwidth.

```javascript
wif = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
pubkey = 'VEX6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'

vex.transaction(tr => {
  tr.newaccount({
    creator: 'vexcore',
    name: 'myaccount',
    owner: pubkey,
    active: pubkey
  })

  tr.buyrambytes({
    payer: 'vexcore',
    receiver: 'myaccount',
    bytes: 8192
  })

  tr.delegatebw({
    from: 'vexcore',
    receiver: 'myaccount',
    stake_net_quantity: '10.0000 VEX',
    stake_cpu_quantity: '10.0000 VEX',
    transfer: 0
  })
})
```

### Contract

Deploy and call smart contracts.

#### Compile

If you're loading a **wasm** file, you do not need binaryen. If you're loading
a **wast** file you can include and configure the binaryen compiler, this is
used to compile to **wasm** automatically when calling **setcode**.

Versions of binaryen may be [problematic](https://github.com/Vexanium/vex/issues/2187).

```bash
$ npm install binaryen@37.0.0
```

```js
binaryen = require('binaryen')
vex = Vex({keyProvider, binaryen})
```

#### Deploy

```javascript
wasm = fs.readFileSync(`docker/contracts/vexio.token/vexio.token.wasm`)
abi = fs.readFileSync(`docker/contracts/vexio.token/vexio.token.abi`)

// Publish contract to the blockchain
vex.setcode('myaccount', 0, 0, wasm) // @returns {Promise}
vex.setabi('myaccount', JSON.parse(abi)) // @returns {Promise}
```

#### Fetch a smart contract

```js
// @returns {Promise}
vex.contract('myaccount', [options], [callback])

// Run immediately, `myaction` returns a Promise
vex.contract('myaccount').then(myaccount => myaccount.myaction(..))

// Group actions. `transaction` returns a Promise but `myaction` does not
vex.transaction('myaccount', myaccount => { myaccount.myaction(..) })

// Transaction with multiple contracts
vex.transaction(['myaccount', 'myaccount2'], ({myaccount, myaccount2}) => {
   myaccount.myaction(..)
   myaccount2.myaction(..)
})
```

#### Offline or cold-storage contract

```js
vex = Vex({httpEndpoint: null})

abi = fs.readFileSync(`docker/contracts/vexio.token/vexio.token.abi`)
vex.fc.abiCache.abi('myaccount', JSON.parse(abi))

// Check that the ABI is available (print usage)
vex.contract('myaccount').then(myaccount => myaccount.create())
```
#### Offline or cold-storage transaction

```js
// ONLINE

// Prepare headers
expireInSeconds = 60 * 60 // 1 hour

vex = Vex(/* {httpEndpoint: 'https://..'} */)

info = await vex.getInfo({})
chainDate = new Date(info.head_block_time + 'Z')
expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
expiration = expiration.toISOString().split('.')[0]

block = await vex.getBlock(info.last_irreversible_block_num)

transactionHeaders = {
  expiration,
  ref_block_num: info.last_irreversible_block_num & 0xFFFF,
  ref_block_prefix: block.ref_block_prefix
}

// OFFLINE (bring `transactionHeaders`)

// All keys in keyProvider will sign.
vex = Vex({httpEndpoint: null, chainId, keyProvider, transactionHeaders})

transfer = await vex.transfer('inita', 'initb', '1.0000 VEX', '')
transferTransaction = transfer.transaction

// ONLINE (bring `transferTransaction`)

vex = Vex(/* {httpEndpoint: 'https://..'} */)

processedTransaction = await vex.pushTransaction(transferTransaction)

// clVex version:
const clVexTransaction = transferTransaction.transaction
clVexTransaction.signatures = transferTransaction.signatures
// `cloes push transaction ${JSON.stringify(clVexTransaction)}`
```

#### Custom Token

```js
// more on the contract / transaction syntax

await vex.transaction('myaccount', myaccount => {

  // Create the initial token with its max supply
  // const options = {authorization: 'myaccount'} // default
  myaccount.create('myaccount', '10000000.000 PHI')//, options)

  // Issue some of the max supply for circulation into an arbitrary account
  myaccount.issue('myaccount', '10000.000 PHI', 'issue')
})

const balance = await vex.getCurrencyBalance('myaccount', 'myaccount', 'PHI')
console.log('Currency Balance', balance)
```

### Calling Actions

Other ways to use contracts and transactions.

```javascript
// if either transfer fails, both will fail (1 transaction, 2 messages)
await vex.transaction(vex =>
  {
    vex.transfer('inita', 'initb', '1.0000 VEX', ''/*memo*/)
    vex.transfer('inita', 'initc', '1.0000 VEX', ''/*memo*/)
    // Returning a promise is optional (but handled as expected)
  }
  // [options],
  // [callback]
)

// transaction on a single contract
await vex.transaction('myaccount', myaccount => {
  myaccount.transfer('myaccount', 'inita', '10.000 PHI', '')
})

// mix contracts in the same transaction
await vex.transaction(['myaccount', 'vex.token'], ({myaccount, vex_token}) => {
  myaccount.transfer('inita', 'initb', '1.000 PHI', '')
  vex_token.transfer('inita', 'initb', '1.0000 VEX', '')
})

// The contract method does not take an array so must be called once for
// each contract that is needed.
const myaccount = await vex.contract('myaccount')
await myaccount.transfer('myaccount', 'inita', '1.000 PHI', '')

// a transaction to a contract instance can specify multiple actions
await myaccount.transaction(myaccountTr => {
  myaccountTr.transfer('inita', 'initb', '1.000 PHI', '')
  myaccountTr.transfer('initb', 'inita', '1.000 PHI', '')
})
```

# Development

From time-to-time the vexaniumjs and nodVex binary format will change between releases
so you may need to start `nodVex` with the `--skip-transaction-signatures` parameter
to get your transactions to pass.

Note, `package.json` has a "main" pointing to `./lib`.  The `./lib` folder is for
es2015 code built in a separate step. If you're changing and testing code,
import from `./src` instead.

```javascript
Vex = require('./src')

// forceActionDataHex = false helps transaction readability but may trigger back-end bugs
config = {verbose: true, debug: false, broadcast: true, forceActionDataHex: true, keyProvider}

vex = Vex(config)
```

#### Fcbuffer

The `vex` instance can provide serialization:

```javascript
// 'asset' is a type but could be any struct or type like: transaction or uint8
type = {type: 1, data: '00ff'}
buffer = vex.fc.toBuffer('extensions_type', type)
assert.deepEqual(type, vex.fc.fromBuffer('extensions_type', buffer))

// ABI Serialization
vex.contract('vex.token', (error, vex_token) => {
  create = {issuer: 'inita', maximum_supply: '1.0000 VEX'}
  buffer = vex_token.fc.toBuffer('create', create)
  assert.deepEqual(create, vex_token.fc.fromBuffer('create', buffer))
})
```

Use Node v10+ for `package-lock.json`.

# Related Libraries

These libraries are integrated into `vexaniumjs` seamlessly so you probably do not
need to use them directly.  They are exported here giving more API access or
in some cases may be used standalone.

```javascript
var {format, api, ecc, json, Fcbuffer} = Vex.modules
```
* format [./format.md](./docs/format.md)
  * Blockchain name validation
  * Asset string formatting

* vexaniumjs-api [[Github](https://github.com/vexio/vexaniumjs-api), [NPM](https://www.npmjs.org/package/vexaniumjs-api)]
  * Remote API to an VEX blockchain node (nodVex)
  * Use this library directly if you need read-only access to the blockchain
    (don't need to sign transactions).

* vexaniumjs-ecc [[Github](https://github.com/vexio/vexaniumjs-ecc), [NPM](https://www.npmjs.org/package/vexaniumjs-ecc)]
  * Private Key, Public Key, Signature, AES, Encryption / Decryption
  * Validate public or private keys
  * Encrypt or decrypt with VEX compatible checksums
  * Calculate a shared secret

* json {[api](https://github.com/Vexanium/vexaniumjs-api/blob/master/src/api), [schema](https://github.com/Vexanium/vexaniumjs/blob/master/src/schema)},
  * Blockchain definitions (api method names, blockchain schema)

* vexaniumjs-keygen [[Github](https://github.com/vexio/vexaniumjs-keygen), [NPM](https://www.npmjs.org/package/vexaniumjs-keygen)]
  * private key storage and key management

* Fcbuffer [[Github](https://github.com/vexio/vexaniumjs-fcbuffer), [NPM](https://www.npmjs.org/package/fcbuffer)]
  * Binary serialization used by the blockchain
  * Clients sign the binary form of the transaction
  * Allows client to know what it is signing

# Environment

Node and browser (es2015)
