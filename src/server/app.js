import Koa from 'koa';

import serve from './middlewares/file';
import api from './routes';
import compose from 'koa-compose';
import {get} from 'koa-route';

const subdomain = (domain, middlewares) => async (ctx, next) => {
  if (ctx.subdomains[0] === domain) {
    return middlewares(ctx, next);
  }
  return next();
};

const app = new Koa();

const admin = compose([
  serve('/bundle.js', './public/bundle.js', 'application/javascript'),
  serve('/bundle.css', './public/bundle.css', 'text/css'),
  api,
  serve('/*', './public/index.html', 'text/html'),
]);

const store = compose([
  get('/*', ctx => {
    ctx.body = 'Hello world!';
  }),
]);

app
  .use(subdomain('admin', admin))
  .use(store);


app.listen(3000);
