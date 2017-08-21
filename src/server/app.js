import Koa from 'koa';

import subdomain from './utils/subdomain';

import cdn from './cdn';
import admin from './admin';
import store from './store';

const app = new Koa();

app
  .use(subdomain('admin', admin))
  .use(subdomain('cdn', cdn))
  .use(store);


app.listen(3000);
