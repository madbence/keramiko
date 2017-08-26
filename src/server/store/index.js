import compose from 'koa-compose';
import {get} from 'koa-route';
import {renderFile} from 'pug';
import serve from '../middlewares/file';
import * as products from '../products';
import config from '../config';
import menu from '../../client/icons/menu';
import cart from '../../client/icons/cart';

const format = n => n.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1 ').split('').reverse().join('') + ' Ft';

export default compose([
  serve('/bundle.css', './public/store.css', 'text/css'),
  get('/products/:id-*', async (ctx, id) => {
    const product = await products.getById(+id);

    if (!product) {
      return;
    }

    ctx.body = renderFile('./src/server/store/product.pug', {
      pretty: true,
      product: {
        name: product.name,
        price: format(product.price),
        preview: product.photos && product.photos[0] ? config.cdn + '/' + product.photos[0].original : 'http://placehold.it/180x240',
        description: product.description,
      },
      icons: {menu, cart},
    });
  }),
  get('/', async ctx => {
    const list = await products.list({
      published: true,
    });
    ctx.body = renderFile('./src/server/store/home.pug', {
      pretty: true,
      products: list.map(item => ({
        name: item.name,
        price: format(item.price),
        thumbnail: item.photos && item.photos[0] ? config.cdn + '/' + item.photos[0].original : 'http://placehold.it/180x240',
        url: item.url,
      })),
      icons: {menu, cart},
    });
  }),
]);
