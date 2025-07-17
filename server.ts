import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine({
    bootstrap,
    providers: [
      // Add global providers here
    ],
  });

  // Security middleware
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://*"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://your-api-domain.com"],
      }
    }
  }));

  // Enable CORS if needed
  server.use(cors({
    origin: process.env['NODE_ENV'] === 'production' 
      ? ['https://your-production-domain.com'] 
      : ['http://localhost:4200'],
    credentials: true
  }));

  // Compression middleware
  server.use(compression());

  // Serve static assets with cache control
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    immutable: true,
    index: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // API routes should be defined before the Angular catch-all
  server.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  // All other routes use Angular Universal
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          // Add request-specific providers here
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => {
        console.error('SSR Error:', err);
        // Fallback to client-side rendering if SSR fails
        res.sendFile(join(browserDistFolder, 'index.html'));
      });
  });

  // Error handling middleware
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).send('Internal Server Error');
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const environment = process.env['NODE_ENV'] || 'development';

  const server = app();
  
  server.listen(port, () => {
    console.log(`Server (${environment}) listening on http://localhost:${port}`);
    console.log(`Serving files from: ${resolve(dirname(fileURLToPath(import.meta.url)), '../browser')}`);
  });
}

// Run the server
if (process.env['NODE_ENV'] !== 'test') {
  run();
}