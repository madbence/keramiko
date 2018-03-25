import {spawn} from 'child_process';
import {watch} from 'chokidar';

import 'keramiko/logger';
import {getLogger} from 'common/logger';

const log = getLogger('chokidar');
const watcher = watch('src/server/**/*.js');

let proc;

async function start(reason) {
  log.info(reason);

  if (proc && !proc.terminated) {
    log.debug('killing existing process...');
    proc.kill('SIGINT');
    await new Promise(resolve => {
      proc.once('exit', (code, signal) => resolve([code, signal]));
    });
  }

  proc = spawn('node_modules/.bin/babel-node', ['src/server/keramiko/app.js'], {
    stdio: 'inherit',
  });

  proc.once('exit', (code, signal) => {
    proc.terminated = true;
    if (code == null) {
      log.debug(`PID ${proc.pid} exited, because it received ${signal}`);
    } else {
      log.error(`PID ${proc.pid} exited with code ${code}`);
    }
  });

  log.info(`server spawned with PID ${proc.pid}`);
}

watcher
  .on('change', path => start(`restarting server, because ${path} changed`));

start('bootstrapping server');
