import {Pool} from 'pg';

class Client {
  constructor(client, logger) {
    this.client = client;
    this.logger = logger;
  }

  async query(sql, params) {
    const start = Date.now();

    try {
      const result = await this.client.query(sql, params);

      const duration = Date.now() - start;
      this.logger.debug({
        duration,
        sql,
        event: 'query.ok',
        length: result.rows.length,
        rowCount: result.rowCount,
        command: result.command,
      }, `${sql}; (${duration}ms)`);

      return result;
    } catch (error) {

      const duration = Date.now() - start;
      this.logger.error({
        duration,
        sql,
        error,
        event: 'query.error',
      }, `${sql}; (${duration}ms)`);

      throw error;
    }
  }

  end() {
    return this.client.end();
  }
}

class PoolClient extends Client {
  release() {
    this.client.release();
  }
}

export default class DatabaseService extends Client {
  constructor({connectionString, logger}) {
    const pool = new Pool({connectionString});
    super(pool, logger);

    pool.on('error', error => logger.error(error));
  }

  async transaction(fn) {
    const client = new PoolClient(await this.client.connect(), this.logger);
    try {
      await client.query('begin');
      await fn(client);
      await client.query('commit');
    } catch (err) {
      await client.query('rollback');
      throw err;
    } finally {
      client.release();
    }
  }
}
