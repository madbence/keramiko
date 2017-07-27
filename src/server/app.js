import Koa from 'koa';
import {post} from 'koa-route';
import compose from 'koa-compose';

import body from './middlewares/json';
import serve from './middlewares/file';

const createProduct = ctx => {
  console.log(ctx.request.body);
  ctx.body = ctx.request.body;
}

const app = new Koa();

app

  .use(serve('/bundle.js', './public/bundle.js', 'application/javascript'))
  .use(serve('/bundle.css', './public/bundle.css', 'text/css'))
  .use(serve('/*', './public/index.html', 'text/html'))

  .use(post('/api/v1/products', compose([body, createProduct])));

app.listen(3000);
