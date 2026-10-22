import path from 'node:path'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import _kebabCase from 'lodash/kebabCase'
import { defineConfig, loadEnv } from 'vite'
import browserslistToEsbuild from 'browserslist-to-esbuild'

import { esbuildPluginLoadJSFilesAsJSX } from './scripts/esbuildPluginLoadJSFilesAsJSX'

const r = (...p) => path.resolve(import.meta.dirname, ...p)

// jsconfig.json baseUrl=src equivalents
const SRC_DIRS = ['components', 'hooks', 'icons', 'locales', 'state', 'styles', 'ui', 'utils', 'var']

// lazy route chunks keep their webpack-era names:
// components/Trades/index.js -> trades, PositionsAudit.NoId.js -> positions-audit-no-id
const getChunkName = ({ name, facadeModuleId }) => {
  if (!facadeModuleId || facadeModuleId.includes('node_modules')) return name
  const { dir, name: base } = path.parse(facadeModuleId)
  return _kebabCase(base === 'index' ? path.basename(dir) : base)
}

// modules reachable from the entry through static imports only
const collectEagerIds = (getModuleIds, getModuleInfo) => {
  const eagerIds = new Set()
  const queue = [...getModuleIds()].filter((id) => getModuleInfo(id)?.isEntry)
  while (queue.length) {
    const id = queue.pop()
    if (!eagerIds.has(id)) {
      eagerIds.add(id)
      queue.push(...(getModuleInfo(id)?.importedIds ?? []))
    }
  }
  return eagerIds
}

export default defineConfig(({ mode }) => {
  // CRA parity: only REACT_APP_* prefixed vars are exposed to the bundle
  const reactAppEnv = loadEnv(mode, process.cwd(), 'REACT_APP_')
  let eagerIds

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
          loadPaths: [r('src')], // bare @import "components/...", "icons/...", "ui/...", "themes"
          quietDeps: true, // Blueprint v3 scss uses legacy division syntax
          silenceDeprecations: ['import'], // own @import usage under dart-sass 1.80+
        },
      },
    },
    server: {
      port: 3000, // development HOME_URL in config.js expects localhost:3000
      strictPort: true, // fail fast instead of silently moving to 3001
      open: true,
    },
    build: {
      outDir: 'build',
      target: browserslistToEsbuild(),
      sourcemap: true,
      rollupOptions: {
        output: { // CRA layout replica so infra rules targeting /static/* keep working
          entryFileNames: 'static/js/[name].[hash].js',
          chunkFileNames: (chunkInfo) => `static/js/${getChunkName(chunkInfo)}.[hash].chunk.js`,
          assetFileNames: (info) => {
            const name = info.names?.[0] ?? ''
            return name.endsWith('.css')
              ? 'static/css/[name].[hash][extname]'
              : 'static/media/[name].[hash][extname]'
          },
          // stable vendor chunks survive app releases in the browser cache, only for node_modules
          // the entry loads anyway: lazy-only deps (recharts, datetime...) stay with the route chunks;
          // path-based matching keeps every file of a package (incl. its CJS internals)
          // in one chunk, the object form leaves them unassigned and creates chunk cycles
          manualChunks: (id, { getModuleIds, getModuleInfo }) => {
            if (!eagerIds) eagerIds = collectEagerIds(getModuleIds, getModuleInfo)
            if (!id.includes('node_modules') || !eagerIds.has(id)) return undefined
            // CSS stays one file in src/index.js import order, the cascade depends on it
            if (/\.css(\?|$)/.test(id)) return undefined
            // reached eagerly only via its index barrel (utils/columns), mostly lazy-only (DataTable)
            if (id.includes('node_modules/@blueprintjs/table/')) return undefined
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react'
            if (/node_modules\/(moment|moment-timezone)\//.test(id)) return 'moment'
            if (/node_modules\/[^/]*i18next[^/]*\//.test(id)) return 'i18n'
            if (/node_modules\/(redux|redux-[^/]+|react-redux|react-router(-dom)?|history)\//.test(id)) return 'redux'
            if (id.includes('node_modules/@blueprintjs/')) return 'blueprint'
            return 'vendor'
          },
        },
      },
    },
    test: {
      globals: true, // bare describe/it/expect like Jest
      environment: 'jsdom', // parity with the former --env=jsdom
      env: { REACT_APP_ENV: 'testing' }, // testing profile, store.js skips the root saga
      setupFiles: ['./vitest.setup.js'],
      include: ['src/**/__tests__/**/*.test.js'],
    },
  }
})
