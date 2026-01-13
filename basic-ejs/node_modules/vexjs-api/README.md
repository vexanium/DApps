[![NPM](https://img.shields.io/npm/v/vexjs-api.svg)](https://www.npmjs.org/package/vexjs-api)

# Vex API

Application programming interface to VEX blockchain nodes.  This is for
read-only API calls.  If you need to sign transactions use
[vexjs](https://github.com/vexanium/vexjs) instead.

# Include

* Install with: `npm install vexjs-api`
* Html script tag, see [releases](https://github.com/vexanium/vexjs-api/releases) for the correct **version** and its matching script **integrity** hash.

```html
<html>
<head>
  <meta charset="utf-8">
  <!--
  sha512-n3CgU6w9TJVf/pVIMHYhk3Gxv8lEQYjVrSSTLXvEBENLF+CQd1Kp0jxXj09yGUOkWerdv2mJlh1Mnz3aRfYqWw== lib/vex-api.js
  sha512-Cj2FQb94MMtDPgHb1R1577pEMjYhc+P5pNgv1/QwoJD9ntuR9rnWlqJACS/xNniNK5cFS6Y6CpQlHWpzWUeEbw== lib/vex-api.min.js
  sha512-4C6oDKarS8DaXO99o342USbeQwqW98qik+QSzVGfof939gUpIyRDCnbGIGQAIkLNpYZIV4XanmRy3wcis6UW8w== lib/vex-api.min.js.map
  -->
  <script src="https://cdn.jsdelivr.net/npm/vexjs-api@7.0.4/lib/vex-api.min.js"
    integrity="sha512-LLDsX/GdVZYA82k9TVz3zUxSjvaX8s5b1FJm64W51JGxLFKI2z+ljqYQtsUZIOxh9pSUqvLA5HCoxXqdRxusKw=="
    crossorigin="anonymous"></script>

</head>
<body>
  See console object: VexApi
</body>
</html>
```

## VexApi

Run [nodeos](https://github.com/vexanium/vex)

* [API](./docs/api.md)
* [Helper Functions](./docs/index.md)

## Usage

```javascript
VexApi = require('vexjs-api') // Or VexApi = require('./src')

vex = VexApi() // // 127.0.0.1:8888

// Any API call without a callback parameter will print documentation: description,
// parameters, return value, and possible errors.  All methods and documentation
// are created from JSON files in vexjs/json/api/v1..
vex.getInfo()

// A Promise is returned if a callback is not provided.
vex.getInfo({}).then(result => console.log(result))
vex.getBlock(1).then(result => console.log(result))

// For callbacks instead of Promises provide a callback
callback = (err, res) => {err ? console.error(err) : console.log(res)}

// The server does not expect any parameters only the callback is needed
vex.getInfo(callback)

// Parameters are added before the callback
vex.getBlock(1, callback)

// Parameters can be an object
vex.getBlock({block_num_or_id: 1}, callback)
vex.getBlock({block_num_or_id: 1}).then(result => console.log(result))
```

## Configuration

```js
VexApi = require('vexjs-api') // Or VexApi = require('./src')

// everything is optional
options = {
  httpEndpoint: 'http://127.0.0.1:8888', // default, null for cold-storage
  verbose: false, // API logging
  logger: { // Default logging functions
    log: config.verbose ? console.log : null,
    error: config.verbose ? console.error : null
  },
  fetchConfiguration: {}
}

vex = VexApi(options)
```
### options.logger example

During testing, an error may be expected and checked as follows:

```js
options.logger = {
  error: err => {
    assert.equal(err, 'expected error')
    done()
  }
}
```

### options.fetchConfiguration example

```js
options.fetchConfiguration = {
  credentials: 'same-origin'
}
```
Every vexjs-api request will run [fetch](https://github.com/github/fetch#sending-cookies) with this configuration:
```js
fetch('https://example.com', {
  credentials: 'same-origin'
})
```

## Environment

Node and browser (es2015)
