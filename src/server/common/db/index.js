import {Pool} from 'pg';

import Client from 'common/db/client';
import PoolClient from 'common/db/pool-client';

export default class DatabaseService extends Client {
  constructor({connectionString, logger}) {
    const pool = new Pool({connectionString});
    super(pool, logger);

    pool.on('error', error => logger.error(error));
  }

  async transaction(fn) {
    const client = new PoolClient(await this.client.connect(), this.logger);
    try {
      return await client.transaction(fn);
    } finally {
      client.release();
    }
  }
}
