/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"
import {createVuePlugin} from 'vite-plugin-vue2'
import PkgConfig from 'vite-plugin-package-config'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import Inspect from 'vite-plugin-inspect'
import legacy from '@vitejs/plugin-legacy'

const alias = [
  { find: /^~/, replacement: '' },
  { find: 'vue', replacement: 'vue/dist/vue.esm' },
  {
    find: '@',
    replacement: resolve(__dirname, 'src'),
  },
]


export default defineConfig({
  base: './',
  root: './',
  publicDir: './static',
  build: {
    outDir: './dist',
  },
  resolve: {
    alias,
    dedupe: ['vue-demi'],
  },
  plugins: [
    createVuePlugin({
      jsx: true,
    }),
    PkgConfig(),
    Inspect(),
    ScriptSetup(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
  ],
  optimizeDeps: {
    // exclude: ['axios'],
  },
  test: {
    environment: 'happy-dom',
    setupFiles: [
      'vitest.setup.ts',
    ],
    globalSetup: 'vitest.global-setup.ts',
  },
})
