import {Pool} from 'pg';

import {getLogger} from 'common/logger';

const pool = new Pool();
const logger = getLogger('db');

export async function query(sql, params) {
  const start = Date.now();
  logger.debug(sql);

  try {
    const result = await pool.query(sql, params);

    const duration = Date.now() - start;
    logger.debug({
      duration,
      sql,
      length: result.rows.length,
      rowCount: result.rowCount,
      command: result.command,
    }, `query was executed in ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error({
      duration,
      sql,
      error,
    });
    throw error;
  }
}
