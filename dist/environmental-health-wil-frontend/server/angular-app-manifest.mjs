
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/MUT-Environmental-Health-Wil-Frontend/',
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
    'index.csr.html': {size: 134360, hash: 'fc091151fad0571358530189fcf5b5bb26e557ec8a7b91fed74b64848609c6ae', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33316, hash: '58de2712b258d14d44dc31a142301bcbc653028970bd733401746d48ca77486f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BF54USQ5.css': {size: 383295, hash: 'DqKqZMot1Zk', text: () => import('./assets-chunks/styles-BF54USQ5_css.mjs').then(m => m.default)}
  },
};
