import Koa from 'koa';
import {post, get} from 'koa-route';
import compose from 'koa-compose';
import {Client} from 'pg';

import body from './middlewares/json';
import serve from './middlewares/file';

const db = new Client();
db.connect();

const createProduct = async ctx => {
  const body = ctx.request.body;

  let res = await db.query('insert into products (name, price, description) values ($1, $2, $3) returning id', [
    body.name,
    body.price,
    body.description,
  ]);
  const id = res.rows[0].id;

  res = await db.query('select * from products where id = $1', [id]);

  ctx.body = res.rows[0];
}

const listProducts = async ctx => {
  let res = await db.query('select * from products order by id asc');
  ctx.body = res.rows;
};

const fetchProduct = async (ctx, id) => {
  let res = await db.query('select * from products where id = $1', [id]);
  ctx.body = res.rows[0];
};

const app = new Koa();

app

  .use(serve('/bundle.js', './public/bundle.js', 'application/javascript'))
  .use(serve('/bundle.css', './public/bundle.css', 'text/css'))

  .use(get('/api/v1/products', listProducts))
  .use(get('/api/v1/products/:id', fetchProduct))
  .use(post('/api/v1/products', compose([body, createProduct])))

  .use(serve('/*', './public/index.html', 'text/html'));

app.listen(3000);
