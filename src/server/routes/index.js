import compose from 'koa-compose';
import {post, put, get} from 'koa-route';

import json from '../utils/json';

import * as products from './products';
import * as photos from './photos';

const errors = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.body = {
      message: err.message,
    };
    ctx.status = err.statusCode || 500;
  }
}

export default compose([

  errors,

  get('/api/v1/products', products.list),
  get('/api/v1/products/:id', products.fetch),
  put('/api/v1/products/:id', products.update),
  post('/api/v1/products', products.create),

  post('/api/v1/photos', photos.upload),
]);
