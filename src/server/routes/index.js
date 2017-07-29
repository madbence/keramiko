import compose from 'koa-compose';
import {post, put, get} from 'koa-route';
import Busboy from 'busboy';
import crypto from 'crypto';

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

function sha1sum(stream) {
  const hash = crypto.createHash('sha1');
  return new Promise((resolve, reject) => {
    stream
      .once('error', reject)
      .pipe(hash)
      .on('readable', () => {
        const data = hash.read();
        if (data) {
          resolve(data.toString('hex'));
        }
      })
      .once('error', reject);
  });
};

const upload = async ctx => {
  const bus = new Busboy({headers: ctx.req.headers});

  const file = await new Promise(resolve => {
    bus.on('file', async (field, stream, name, encoding, type) => {
      resolve({name, type, sha1: await sha1sum(stream)});
    });
    ctx.req.pipe(bus);
  });

  if (!bus._finished) {
    await new Promise(resolve => bus.once('finish', resolve));
  }

  ctx.body = file;
};

export default compose([
  get('/api/v1/products', list),
  get('/api/v1/products/:id', fetch),
  put('/api/v1/products/:id', update),
  post('/api/v1/products', create),

  post('/api/v1/images', upload),
]);
