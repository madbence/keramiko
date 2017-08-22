import compose from 'koa-compose';
import {post, put, get} from 'koa-route';
import Busboy from 'busboy';

import json from '../utils/json';

import * as products from './products';
import uploadImage from '../images/upload';

const upload = async ctx => {
  const bus = new Busboy({headers: ctx.req.headers});

  const file = await new Promise(resolve => {
    bus.on('file', async (field, stream, name, encoding, type) => {
      switch (type) {
        case 'image/png': type = 'png'; break;
        case 'image/jpeg': type = 'jpg'; break;
        default: throw new Error(`Type '${type}' not supported!`);
      }

      resolve(await uploadImage(stream, type));
    });
    ctx.req.pipe(bus);
  });

  if (!bus._finished) {
    await new Promise(resolve => bus.once('finish', resolve));
  }

  ctx.body = file;
};

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

  post('/api/v1/photos', upload),
]);
