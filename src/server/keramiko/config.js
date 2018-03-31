import config from 'common/config';
import DatabaseService from 'common/db';
import createLogger from 'keramiko/logger';
import ProductRepository from 'keramiko/models/product';

const logger = createLogger();
const db = new DatabaseService({
  connectionString: `postgres://${config.db.user}@${config.db.host}`,
  logger: logger.child('db'),
});

const products = new ProductRepository({db});

export {products, logger, db};
