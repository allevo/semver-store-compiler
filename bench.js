'use strict'

const Benchmark = require('benchmark')
const suite = Benchmark.Suite()

const SemVerStore = require('semver-store')
const store = SemVerStore()

store
  .set('1.1.1', 1)
  .set('1.1.2', 1)
  .set('1.1.3', 1)
  .set('1.2.1', 1)
  .set('1.2.2', 1)
  .set('1.2.3', 1)
  .set('2.1.1', 1)
  .set('2.1.2', 1)
  .set('2.1.3', 1)
  .set('3.2.1', 1)
  .set('3.2.2', 1)
  .set('3.2.3', 1)
  .set('33.2.3', 1)

const f = require('./')(store)

suite
  .add('get', function () {
    store.get('1.2.3')
  })
  .add('get - compiled', function () {
    f('1.2.3')
  })
  .add('get (wildcard)', function () {
    store.get('*')
  })
  .add('get (wildcard) - compiled', function () {
    f('*')
  })
  .add('get (minor wildcard)', function () {
    store.get('1.x')
  })
  .add('get (minor wildcard) - compiled', function () {
    f('1.x')
  })
  .add('get (patch wildcard)', function () {
    store.get('1.2.x')
  })
  .add('get (patch wildcard) - compiled', function () {
    f('1.2.x')
  })
  .add('not optimized', function () {
    store.get('33.2.3')
  })
  .add('not optimized - compiled', function () {
    f('33.2.3')
  })
  .add('not found', function () {
    store.get('5.2.1')
  })
  .add('not found - compiled', function () {
    store.get('5.2.1')
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {})
  .run()
