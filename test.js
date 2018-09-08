'use strict'

const t = require('tap')
const SemVerStore = require('semver-store')
const compile = require('./')

t.test('sssc', t => {
  const store = SemVerStore()

  store
    .set('1.2.3', 1)
    .set('1.2.4', 2)
    .set('1.3.0', 3)
    .set('2.0.1', 4)
    .set('5.0.1', 5)
    .set('55.0.1', 6)
    .set('5.50.1', 7)
    .set('5.5.18', 8)

  const f = compile(store, { debug: false })

  t.equal(f('1.2.3'), 1)
  t.equal(f('1.2.4'), 2)
  t.equal(f('1.3.0'), 3)
  t.equal(f('2.0.1'), 4)
  t.equal(f('5.0.1'), 5)

  t.equal(f('1.2.x'), 2)
  t.equal(f('1.x'), 3)
  t.equal(f('*'), 6)

  t.equal(f('55.0.1'), 6)
  t.equal(f('5.50.1'), 7)
  t.equal(f('5.5.18'), 8)

  t.equal(f('6.6.6'), null)
  t.equal(f('6.a'), null)
  t.equal(f('x'), null)

  t.end()
})
