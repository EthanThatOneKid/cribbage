# cribbage
![bundle size](https://img.shields.io/bundlephobia/min/cribbage.svg)
![npm downloads](https://img.shields.io/npm/dt/cribbage.svg)

an NPM package that calculates cribbage hands

## Installation
`npm i cribbage`

## Usage
```javascript
const Cribbage = require('cribbage');
const crib = new Cribbage([
  {
    "card": <int 2-10 | string A, J, Q, K>,
    "suit": <string S, C, D, H>
  },
  ...<x5>
]);
```

## Documentation
### `Cribbage.summary()`
* returns all relevant data concerning its hand
