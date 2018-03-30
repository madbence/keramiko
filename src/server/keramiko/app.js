import Koa from 'koa';

import {logger} from 'keramiko/config';
import router from 'keramiko/router';

const app = new Koa();
const log = logger.child('http.app');

app

  .use(router);

const server = app.listen(3000, () => {
  const address = server.address();
  log.info(`server listening on port ${address.port} at ${address.address}`);
});
