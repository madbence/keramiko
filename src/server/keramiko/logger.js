import {create} from 'common/logger';

export default create({
  handler: record => {
    record.date = new Date();
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
