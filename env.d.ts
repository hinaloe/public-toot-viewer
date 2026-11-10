/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// Make this file a module so that `declare global` takes effect.
// oxlint-disable-next-line unicorn/require-module-specifiers
export {}
