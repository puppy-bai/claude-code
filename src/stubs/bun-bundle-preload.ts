import { plugin } from 'bun'

plugin({
  name: 'bun-bundle-polyfill',
  setup(build) {
    const filter = /^bun:bundle$|^bundle$/
    build.onResolve({ filter }, () => ({
      path: 'bun-bundle-polyfill',
      namespace: 'bun-bundle-ns',
    }))
    build.onLoad({ filter: /.*/, namespace: 'bun-bundle-ns' }, () => ({
      contents: `export function feature(name) { return false }`,
      loader: 'js',
    }))
  },
})
