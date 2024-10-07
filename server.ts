import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Middleware для обработки JSON-запросов
  server.use(express.json());

  // Пример Express Rest API для обновления данных пользователя
  server.post('/api/orex/update', (req, res) => {
    const { telegramId, firstName, lastName, username, orex, xiom } = req.body;

    if (!telegramId || orex == null || xiom == null) {
      return res.status(400).json({ message: 'Не все данные были предоставлены' });
    }

    try {
      // Логика обновления базы данных
      // Например, обновляем пользователя:
      // User.findOneAndUpdate({ telegramId }, { firstName, lastName, username, orex, xiom });

      return res.json({ message: 'Данные успешно обновлены' });
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
      return res.status(500).json({ message: 'Ошибка обновления данных' });
    }
  });

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // Все остальные маршруты используют Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 3000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
