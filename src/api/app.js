import Koa from 'koa';
import {get} from 'koa-route';
import fs from 'fs';

const serve = (url, path, type) => get(url, async ctx => {
  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });

  ctx.body = buffer;
  ctx.type = type;
});

const app = new Koa();

app

  .use(serve('/bundle.js', './public/bundle.js', 'application/javascript'))
  .use(serve('/bundle.css', './public/bundle.css', 'text/css'))
  .use(serve('/*', './public/index.html', 'text/html'));

app.listen(3000);
