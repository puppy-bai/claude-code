// Entry point wrapper that registers bun:bundle polyfill before loading main
// This is needed because bun:bundle is a compile-time-only module in production Bun builds

import { plugin } from 'bun'

// Register a runtime plugin to intercept bun:bundle imports
plugin({
  name: 'bun-bundle-polyfill',
  setup(build) {
    build.onResolve({ filter: /^bun:bundle$|^bundle$/ }, (args) => {
      return {
        path: import.meta.dir + '/stubs/bun-bundle-runtime.ts',
        namespace: 'file',
      }
    })
  },
})

// Now load the actual main module
await import('./main.tsx')
