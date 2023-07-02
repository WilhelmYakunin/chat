import fs from 'fs';
import path from 'path';
import express from 'express';
import { dirname } from 'path';
import { createServer as createViteServer } from 'vite';
import { IncomingHttpHeaders, ServerResponse } from 'http';
import { port } from './vite.config.ts';

export type IncomingHTTPHeaders = IncomingHttpHeaders;
export type IncomingHTTPResponse = ServerResponse;

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(
        path.resolve(dirname('./'), 'index.html'),
        'utf-8'
      );

      template = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule('/src/entry-server.js');
      const appHtml = await render(url);
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: unknown) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
        res.status(500).end(e.message);
      }
    }
  });

  app.listen(port);
}

createServer();
