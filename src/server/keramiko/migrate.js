import {readdirSync} from 'fs';
import {logger as log, db} from 'keramiko/config';

const direction = process.argv[2] === 'down' ? 'down' : 'up';
const logger = log.child('migrate');
const migrations = readdirSync(__dirname + '/migrations').sort((a, b) => direction === 'up' ? a.localeCompare(b) : b.localeCompare(a));

(async () => {
  for (const migration of migrations) {
    logger.info('applying migration ' + migration);
    // eslint-disable-next-line global-require
    const module = require(__dirname + '/migrations/' + migration);
    await module[direction]({db});
  }
})().catch(err => {
  logger.error(err);
});
