import compose from 'koa-compose';
import {get} from 'koa-route';
import {products} from 'keramiko/config';

export default compose([
  get('/api/v1/products', async ctx => {
    ctx.body = await products.list(10, 0);
  }),
]);
