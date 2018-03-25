import compose from 'koa-compose';
import {get} from 'koa-route';

import * as products from 'keramiko/models/product';

export default compose([
  get('/api/v1/products', async ctx => {
    ctx.body = await products.list(10, 0);
  }),
]);
