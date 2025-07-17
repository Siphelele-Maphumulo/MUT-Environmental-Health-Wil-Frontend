
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://github.com/Siphelele-Maphumulo/MUT-Environmental-Health-Wil-Frontend.git/',
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
    'index.csr.html': {size: 139445, hash: '7a238d96d2fe5c627e7397aa3b8cbbd0f149e719128d8a12ceb7ddb8430b44c5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 33358, hash: '4df3ce6d1ddaec6ee1ca75e5bc8bf5c7e1bbf42b62dffa234c4e557dd9152397', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-CAMUG7EX.css': {size: 388338, hash: 'MuM6YTd51D8', text: () => import('./assets-chunks/styles-CAMUG7EX_css.mjs').then(m => m.default)}
  },
};
