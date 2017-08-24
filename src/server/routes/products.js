import * as products from '../products';
import json from '../utils/json';

export const create = async ctx => {
  const body = await json(ctx.req);
  ctx.body = await products.create({
    name: body.name,
    price: body.price,
    description: body.description,
    published: body.published,
    tags: body.tags,
  });
};

export const update = async (ctx, id) => {
  const body = await json(ctx.req);
  ctx.body = await products.update({
    id,
    name: body.name,
    price: body.price,
    description: body.description,
    published: body.published,
    tags: body.tags,
  });
};

export const list = async ctx => {
  ctx.body = await products.list();
};

export const fetch = async (ctx, id) => {
  ctx.body = await products.getById(id);
};

export const addPhoto = async (ctx, id) => {
  const body = await json(ctx.req);
  await products.addPhoto(id, body.photoId);
  ctx.body = {ok: true};
}
