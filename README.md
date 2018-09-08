# semver-store-compiler
Compiler for semver-store

[![Build Status](https://travis-ci.org/allevo/semver-store-compiler.svg?branch=master)](https://travis-ci.org/allevo/semver-store-compiler)
[![Coverage Status](https://coveralls.io/repos/github/allevo/semver-store-compiler/badge.svg?branch=master)](https://coveralls.io/github/allevo/semver-store-compiler?branch=master)

## Usage

```js

const SemVerStore = require('semver-store')
const compile = require('semver-store-compiler')
const store = SemVerStore()

store
  .set('1.1.1', 1)
  .set('1.1.2', 2)
  .set('1.1.3', 3)
  .set('1.4.3', 4)
  .set('5.3.3', 5)

const f = compile(store)

console.log(f('1.1.1')) // 1
console.log(f('1.1.x')) // 3
console.log(f('1.x')) // 4
console.log(f('*')) // 5
```
