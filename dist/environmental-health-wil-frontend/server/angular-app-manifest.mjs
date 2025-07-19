
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
    'index.csr.html': {size: 134322, hash: '7a0c6c9ef958f89b28ba0fb5a13b443e33a2d5eb8bf7864f59a6723267d90b85', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33278, hash: 'e662d3e4f599c8117b6e6c53f4c897fbbb94bcad95c72ef790824c27e9369390', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BF54USQ5.css': {size: 383295, hash: 'DqKqZMot1Zk', text: () => import('./assets-chunks/styles-BF54USQ5_css.mjs').then(m => m.default)}
  },
};
