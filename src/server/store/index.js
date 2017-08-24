import compose from 'koa-compose';
import {get} from 'koa-route';
import {renderFile} from 'pug';
import serve from '../middlewares/file';
import * as products from '../products';
import config from '../config';
import bars from '../../client/icons/bars';
import shoppingCart from '../../client/icons/shopping-cart';

const format = n => n.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1 ').split('').reverse().join('') + ' Ft';

export default compose([
  serve('/bundle.css', './public/store.css', 'text/css'),
  get('/*', async ctx => {
    const list = await products.list();
    ctx.body = renderFile('./src/server/store/home.pug', {
      pretty: true,
      products: list.map(item => ({
        name: item.name,
        price: format(item.price),
        thumbnail: item.photos && item.photos[0] ? config.cdn + '/' + item.photos[0].original : 'http://placehold.it/180x240',
        url: item.url,
      })),
      icons: {
        bars: bars,
        'shopping-cart': shoppingCart,
      },
    });
  }),
]);
