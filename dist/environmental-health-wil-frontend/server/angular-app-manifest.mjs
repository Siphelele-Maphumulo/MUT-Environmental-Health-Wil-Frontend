
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
    'index.csr.html': {size: 134360, hash: '2973e7e9b17182b86e1c333d7ef6e2567abf6824a7ead2e732aacaf9ccf5f38b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33316, hash: '40cb8029057fb66deaf227163a846aade01cb3d29a9e946b9197c3c7d0d72879', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BF54USQ5.css': {size: 383295, hash: 'DqKqZMot1Zk', text: () => import('./assets-chunks/styles-BF54USQ5_css.mjs').then(m => m.default)}
  },
};
