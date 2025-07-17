
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
    'index.csr.html': {size: 139365, hash: 'b384eb81fae9599d2fb13c6c31d8c983d66fc5d7f2c427f123f80db51cad81d2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33278, hash: 'e7009c6ddf5829e3e3c01e4d07eabac2629c7d35e8fd7f7dc9a317cb07b256a1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-CAMUG7EX.css': {size: 388338, hash: 'MuM6YTd51D8', text: () => import('./assets-chunks/styles-CAMUG7EX_css.mjs').then(m => m.default)}
  },
};
