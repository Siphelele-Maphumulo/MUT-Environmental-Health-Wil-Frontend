
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-ZNQBGVUG.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 134322, hash: '24a0e7c44d3bc695473d88802939d469ba0db6389fd3707e5c0762dcb2fd9151', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33278, hash: 'd5d6106265b7b44804a77559ae5f40705f0d873b38a3364f63e56cdf29c6044c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BF54USQ5.css': {size: 383295, hash: 'DqKqZMot1Zk', text: () => import('./assets-chunks/styles-BF54USQ5_css.mjs').then(m => m.default)}
  },
};
