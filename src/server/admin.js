import compose from 'koa-compose';
import {get} from 'koa-route';
import serve from './middlewares/file';
import api from './routes';
import config from './config';

export default compose([
  serve('/bundle.js', './public/bundle.js', 'application/javascript'),
  serve('/bundle.css', './public/admin.css', 'text/css'),
  get('/config.js', ctx => {
    ctx.body = 'window.__config__ = ' + JSON.stringify({
      cdn: config.cdn,
    });
  }),
  api,
  serve('/*', './public/index.html', 'text/html'),
]);
