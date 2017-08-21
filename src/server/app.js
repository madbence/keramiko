import fs from 'fs';
import {join} from 'path';
import Koa from 'koa';
import compose from 'koa-compose';
import {get} from 'koa-route';

import config from './config';
import serve from './middlewares/file';
import api from './routes';
import subdomain from './utils/subdomain';

const app = new Koa();

const admin = compose([
  serve('/bundle.js', './public/bundle.js', 'application/javascript'),
  serve('/bundle.css', './public/bundle.css', 'text/css'),
  get('/config.js', ctx => {
    ctx.body = 'window.__config__ = ' + JSON.stringify({
      cdn: config.cdn,
    });
  }),
  api,
  serve('/*', './public/index.html', 'text/html'),
]);

const cdn = get('/*', (ctx, url) => {
  const match = url.match(/^(.*?)(-.*?)?\.(.*?)$/);
  if (!match) {
    return;
  }

  const hash = match[1];
  const ext = match[3];
  const path = join(config.uploadDir, hash + '.' + ext);
  const mime = ext === 'jpg' ? 'jpeg' : 'png';
  ctx.body = fs.createReadStream(path);
  ctx.type = 'image/' + mime;
});

const store = compose([
  get('/*', ctx => {
    ctx.body = 'Hello world!';
  }),
]);

app
  .use(subdomain('admin', admin))
  .use(subdomain('cdn', cdn))
  .use(store);


app.listen(3000);
