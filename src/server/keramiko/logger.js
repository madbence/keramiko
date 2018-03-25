import {configure} from 'common/logger';

configure({
  handler: record => {
    record.date = new Date();

    if (record.error) {
      const error = record.error;
      record.error = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
      if (!record.message) record.message = error.message;
    }

    // eslint-disable-next-line no-console
    console.log(`[${record.date.toISOString()}][${record.name}][${record.level}] ${record.message}`);
  },

  context: {
    process: {
      arch: process.arch,
      platform: process.platform,
      pid: process.pid,
      ppid: process.ppid,
      version: process.version,
    },
  },
});
