import {create} from 'common/logger';

export default create({
  handler: record => {
    record.date = new Date();
    console.log(JSON.stringify(record));
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
