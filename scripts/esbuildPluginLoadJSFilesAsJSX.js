import fs from 'fs/promises'

// jsx loader for .js files during the optimizeDeps scan (JSX lives in .js files, CRA legacy)
export const esbuildPluginLoadJSFilesAsJSX = {
  name: 'vite-plugin-load-js-files-as-jsx',
  setup(build) {
    build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
      loader: 'jsx',
      contents: await fs.readFile(args.path, 'utf8'),
    }))
  },
}
