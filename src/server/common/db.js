import {Pool} from 'pg';

export default class DatabaseService {
  constructor({connectionString, logger}) {
    this.pool = new Pool({connectionString});
    this.logger = logger;
  }

  async query(sql, params) {
    const start = Date.now();

    try {
      const result = await this.pool.query(sql, params);

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
}
