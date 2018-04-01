export default class Client {
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

  async transaction(fn) {
    try {
      await this.query('begin');
      await fn(this);
      await this.query('commit');
    } catch (err) {
      await this.query('rollback');
      throw err;
    }
  }

  end() {
    return this.client.end();
  }
}
