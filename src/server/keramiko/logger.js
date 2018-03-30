import create from 'common/logger';

export default function createLogger() {
  return create({
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
      console.log(`[${record.date.toISOString()}][${record.name}][${record.level}]${record.event ? `[${record.event}]` : ''} ${record.message}`);
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
}
