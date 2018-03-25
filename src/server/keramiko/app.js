import Koa from 'koa';

import 'keramiko/logger';
import router from 'keramiko/router';
import {getLogger} from 'common/logger';

const app = new Koa();
const log = getLogger('http.app');

app

  .use(router);

const server = app.listen(3000, () => {
  const address = server.address();
  log.info(`server listening on port ${address.port} at ${address.address}`);
});
