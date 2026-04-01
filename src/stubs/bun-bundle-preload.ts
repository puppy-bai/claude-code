import { plugin } from 'bun'
import { readFileSync } from 'fs'
import { join } from 'path'

plugin({
  name: 'bun-bundle-polyfill',
  setup(build) {
    const filter = /^bun:bundle$|^bundle$/
    build.onResolve({ filter }, () => ({
      path: 'bun-bundle-polyfill',
      namespace: 'bun-bundle-ns',
    }))
    
    let polyfillCode = `export function feature(name) { return false }`
    try {
      polyfillCode = readFileSync(join(process.cwd(), 'node_modules/bundle/index.js'), 'utf-8')
    } catch (e) {
      // Fallback
    }

    build.onLoad({ filter: /.*/, namespace: 'bun-bundle-ns' }, () => ({
      contents: polyfillCode,
      loader: 'js',
    }))
  },
})
