import Koa from 'koa';
import {post, put, get} from 'koa-route';

import json from './utils/json';
import serve from './middlewares/file';

import {createProduct, updateProduct, getProducts, getProductById} from './products';

const create = async ctx => {
  const body = await json(ctx.req);
  ctx.body = await createProduct({
    name: body.name,
    price: body.price,
    description: body.description,
  });
}

const update = async (ctx, id) => {
  const body = await json(ctx.req);
  ctx.body = await updateProduct({
    id,
    name: body.name,
    price: body.price,
    description: body.description,
  });
}

const list = async ctx => {
  ctx.body = await getProducts();
};

const fetch = async (ctx, id) => {
  ctx.body = await getProductById(id);
};

const app = new Koa();

app

  .use(serve('/bundle.js', './public/bundle.js', 'application/javascript'))
  .use(serve('/bundle.css', './public/bundle.css', 'text/css'))

  .use(get('/api/v1/products', list))
  .use(get('/api/v1/products/:id', fetch))
  .use(put('/api/v1/products/:id', update))
  .use(post('/api/v1/products', create))

  .use(serve('/*', './public/index.html', 'text/html'));

app.listen(3000);
