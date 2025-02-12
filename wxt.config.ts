import { defineConfig } from 'wxt';
import { defineConfig as defineViteConfig } from 'vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Facebook Chat Manager',
    description: 'Bulk delete and archive Facebook messages',
    version: '1.0.0',
    permissions: [
      "tabs"  // Need this for tab manipulation
    ],
    host_permissions: [
      "https://*.facebook.com/*",
      "https://*.messenger.com/*"
    ]
  },
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-react'],
  vite: () => defineViteConfig({
    optimizeDeps: {
      include: ['i18next'],
      exclude: ['@webext-core/isolated-element']
    },
    build: {
      commonjsOptions: {
        include: [/i18next/, /node_modules/],
        transformMixedEsModules: true
      }
    },
    resolve: {
      alias: {
        'is-potential-custom-element-name': 'is-potential-custom-element-name/index.js'
      }
    }
  })
});
