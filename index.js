'use strict'

const genfun = require('generate-function')

module.exports = function compiler (semverStore, { debug } = {}) {
  const gen = genfun()
  debug = !!debug

  function generateValueVariableName (M, m, p) {
    return 'v' + [M, m, p].filter(x => x !== undefined).map(x => x === '*' ? 'w' : x).join('_')
  }

  const scope = { store: semverStore }

  gen('function svs (ver) {')
  gen('if (ver.length === 1) {')
  gen('var M = ver.charCodeAt(0) - %d', '0'.charCodeAt(0))
  if (debug) gen('console.log("M", M)')
  const MMax = Math.max.apply(Math, semverStore.tree.childrenPrefixes)
  for (let Mi = 0; Mi < semverStore.tree.childrenPrefixes.length; Mi++) {
    let M = semverStore.tree.childrenPrefixes[Mi]
    const valueVariableName = generateValueVariableName(M, 'x')
    if (M === MMax) {
      gen('if (M === %d || M === %d) {', M, '*'.charCodeAt(0) - '0'.charCodeAt(0))
    } else {
      gen('if (M === %d) {', M)
    }
    scope[valueVariableName] = semverStore.get(M === '*' ? M : (M + '.x'))
    gen('return %s', valueVariableName)
    gen('}')
  }
  gen('return null')
  gen('}')
  // M.m
  gen('if (ver.length === 3 && ver.charCodeAt(1) === %d) {', '.'.charCodeAt(0))
  gen('var M = ver.charCodeAt(0) - %d', '0'.charCodeAt(0))
  gen('var m = ver.charCodeAt(2) - %d', '0'.charCodeAt(0))
  if (debug) gen('console.log("M", M, "m", m)')
  for (let Mi = 0; Mi < semverStore.tree.childrenPrefixes.length; Mi++) {
    let M = semverStore.tree.childrenPrefixes[Mi]
    gen('if (M === %d) {', M)

    const mMax = Math.max.apply(Math, semverStore.tree.children[M].childrenPrefixes)
    for (let mi = 0; mi < semverStore.tree.children[M].childrenPrefixes.length; mi++) {
      let m = semverStore.tree.children[M].childrenPrefixes[mi]
      const valueVariableName = generateValueVariableName(M, m, 'x')
      if (m === mMax) {
        gen('if (m === %d || m === %d) {', m, 'x'.charCodeAt(0) - '0'.charCodeAt(0))
      } else {
        gen('if (m === %d) {', m)
      }
      scope[valueVariableName] = semverStore.get([M, m].join('.'))
      gen('return %s', valueVariableName)
      gen('}')
    }
    gen('return null')
    gen('}')
  }

  gen('}')
  // We can optimize if the version is M.m.p
  gen('if (ver.length === 5 && ver.charCodeAt(1) === %d && ver.charCodeAt(3) === %d) {', '.'.charCodeAt(0), '.'.charCodeAt(0))
  gen('var M = ver.charCodeAt(0) - %d', '0'.charCodeAt(0))
  gen('var m = ver.charCodeAt(2) - %d', '0'.charCodeAt(0))
  gen('var p = ver.charCodeAt(4) - %d', '0'.charCodeAt(0))
  if (debug) gen('console.log("M", M, "m", m, "p", p)')

  for (let Mi = 0; Mi < semverStore.tree.childrenPrefixes.length; Mi++) {
    let M = semverStore.tree.childrenPrefixes[Mi]
    gen('if (M === %d) {', M)

    for (let mi = 0; mi < semverStore.tree.children[M].childrenPrefixes.length; mi++) {
      let m = semverStore.tree.children[M].childrenPrefixes[mi]
      gen('if (m === %d) {', m)

      const pMax = Math.max.apply(Math, semverStore.tree.children[M].children[m].childrenPrefixes)
      for (var pi = 0; pi < semverStore.tree.children[M].children[m].childrenPrefixes.length; pi++) {
        var p = semverStore.tree.children[M].children[m].childrenPrefixes[pi]
        const valueVariableName = generateValueVariableName(M, m, p)
        if (p === pMax) {
          gen('if (p === %d || p === %d) {', p, 'x'.charCodeAt(0) - '0'.charCodeAt(0))
        } else {
          gen('if (p === %d) {', p)
        }
        scope[valueVariableName] = semverStore.get([M, m, p].join('.'))
        gen('return %s', valueVariableName)
        gen('}')
      }

      gen('return null')
      gen('}')
    }

    gen('return null')
    gen('}')
  }
  gen('}')
  gen('return store.get(ver)')
  gen('}')

  if (debug) console.log(gen.toString())
  if (debug) console.log(scope)

  return gen.toFunction(scope)
}
