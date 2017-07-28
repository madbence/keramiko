import Koa from 'koa';

import serve from './middlewares/file';
import api from './routes';

const app = new Koa();

app

  .use(serve('/bundle.js', './public/bundle.js', 'application/javascript'))
  .use(serve('/bundle.css', './public/bundle.css', 'text/css'))
  .use(api)
  .use(serve('/*', './public/index.html', 'text/html'));

app.listen(3000);
