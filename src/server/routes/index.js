import compose from 'koa-compose';
import {post, put, get} from 'koa-route';

import json from '../utils/json';

import {createProduct, updateProduct, getProducts, getProductById} from '../products';

const create = async ctx => {
  const body = await json(ctx.req);
  ctx.body = await createProduct({
    name: body.name,
    price: body.price,
    description: body.description,
  });
};

const update = async (ctx, id) => {
  const body = await json(ctx.req);
  ctx.body = await updateProduct({
    id,
    name: body.name,
    price: body.price,
    description: body.description,
  });
};

const list = async ctx => {
  ctx.body = await getProducts();
};

const fetch = async (ctx, id) => {
  ctx.body = await getProductById(id);
};

export default compose([
  get('/api/v1/products', list),
  get('/api/v1/products/:id', fetch),
  put('/api/v1/products/:id', update),
  post('/api/v1/products', create),
]);
