import compose from 'koa-compose';
import {post, put, get} from 'koa-route';

import json from '../utils/json';
import * as jwt from '../utils/jwt';

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
};

const auth = async (ctx, next) => {
  let token;
  if (ctx.path === '/') {
    token = await jwt.sign({ok: true}, process.env.SECRET);
    ctx.cookies.set('session', token);
  }

  try {
    await jwt.verify(token || ctx.cookies.get('session'), process.env.SECRET);
    await next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      err.statusCode = 403;
      err.message = 'Hozzáférési hiba, kérlek jelentkezz be újra!';
      throw err;
    }
  }
};

export default compose([

  errors,
  auth,

  get('/api/v1/products', products.list),
  get('/api/v1/products/:id', products.fetch),
  put('/api/v1/products/:id', products.update),
  post('/api/v1/products', products.create),
  post('/api/v1/products/:id/photos', products.addPhoto),

  post('/api/v1/photos', photos.upload),
]);
