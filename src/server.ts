// // server.ts
// import 'zone.js/node';
// import { ngExpressEngine } from '@nguniversal/express-engine';
// import express from 'express';
// import { join } from 'path';

// import { AppServerModule } from './src/main.server';

// const app = express();
// const distFolder = join(process.cwd(), 'dist/environmental-health-wil-frontend/browser');

// app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
// app.set('view engine', 'html');
// app.set('views', distFolder);

// app.get('*.*', express.static(distFolder));
// app.get('*', (req, res) => {
//   res.render('index.html', { req });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });