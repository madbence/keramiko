import {Pool} from 'pg';

import {getLogger} from 'common/logger';

const pool = new Pool();
const logger = getLogger('db');

export async function query(sql, params) {
  const start = Date.now();

  try {
    const result = await pool.query(sql, params);

    const duration = Date.now() - start;
    logger.debug({
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
    logger.error({
      duration,
      sql,
      error,
      event: 'query.error',
    }, `${sql}; (${duration}ms)`);

    throw error;
  }
}
