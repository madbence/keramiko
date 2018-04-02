import config from 'common/config';
import DatabaseService from 'common/db';
import {EventRepository} from 'common/event';

import createLogger from 'keramiko/logger';
import ProductRepository from 'keramiko/models/product';

const logger = createLogger();
const db = new DatabaseService({
  connectionString: `postgres://${config.db.user}@${config.db.host}`,
  logger: logger.child('db'),
});
const store = new EventRepository({db});

const products = new ProductRepository({db, store});

export {products, logger, db};
