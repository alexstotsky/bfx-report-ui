import path from 'node:path'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'

import { esbuildPluginLoadJSFilesAsJSX } from './scripts/esbuildPluginLoadJSFilesAsJSX'

const r = (...p) => path.resolve(import.meta.dirname, ...p)

// jsconfig.json baseUrl=src equivalents
const SRC_DIRS = ['components', 'hooks', 'icons', 'locales', 'state', 'styles', 'ui', 'utils', 'var']

export default defineConfig(({ mode }) => {
  // CRA parity: only REACT_APP_* prefixed vars are exposed to the bundle
  const reactAppEnv = loadEnv(mode, process.cwd(), 'REACT_APP_')

  return {
    base: '/',
    plugins: [
      react(),
      // CRA parity for `import { ReactComponent as X } from './x.svg'`,
      // scoped to src/icons so svg-as-URL imports elsewhere keep default asset handling
      svgr({
        include: '**/src/icons/*.svg',
        svgrOptions: { exportType: 'named', namedExport: 'ReactComponent' },
      }),
    ],
    resolve: {
      alias: [
        ...SRC_DIRS.map((dir) => ({ find: dir, replacement: r('src', dir) })),
        { find: 'config', replacement: r('src/config.js') },
      ],
    },
    define: {
      // whole-object replacement: src destructures process.env;
      // unprefixed vars (CI_ENVIRONMENT_NAME, DOMAIN) intentionally absent (undefined under CRA too)
      'process.env': JSON.stringify({
        NODE_ENV: mode === 'production' ? 'production' : 'development',
        ...reactAppEnv,
      }),
    },
    esbuild: {
      // JSX lives in .js files (CRA default)
      loader: 'jsx',
      include: /src\/.*\.js$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        plugins: [esbuildPluginLoadJSFilesAsJSX],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: [r('src')],           // bare @import "components/...", "icons/...", "ui/...", "themes"
          quietDeps: true,                 // Blueprint v3 scss uses legacy division syntax
          silenceDeprecations: ['import'], // own @import usage under dart-sass 1.80+
        },
      },
    },
    server: {
      port: 3000, // development HOME_URL in config.js expects localhost:3000
      open: true,
    },
    build: {
      outDir: 'build',
      target: browserslistToEsbuild(),
      sourcemap: true,
      rollupOptions: {
        output: { // CRA layout replica so infra rules targeting /static/* keep working
          entryFileNames: 'static/js/[name].[hash].js',
          chunkFileNames: 'static/js/[name].[hash].chunk.js',
          assetFileNames: (info) => {
            const name = info.names?.[0] ?? ''
            return name.endsWith('.css')
              ? 'static/css/[name].[hash][extname]'
              : 'static/media/[name].[hash][extname]'
          },
        },
      },
    },
    test: {
      globals: true,          // bare describe/it/expect like Jest
      environment: 'jsdom',   // parity with the former --env=jsdom
      setupFiles: ['./vitest.setup.js'],
      include: ['src/**/__tests__/**/*.test.js'],
    },
  }
})
