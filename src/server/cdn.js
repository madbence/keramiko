import fs from 'fs';
import {join} from 'path';
import {get} from 'koa-route';
import config from './config';

export default get('/*', (ctx, url) => {
  const match = url.match(/^(.*?)(-.*?)?\.(.*?)$/);
  if (!match) {
    return;
  }

  const hash = match[1];
  const ext = match[3];
  const path = join(config.uploadDir, hash + '.' + ext);
  const mime = ext === 'jpg' ? 'jpeg' : 'png';
  ctx.body = fs.createReadStream(path);
  ctx.type = 'image/' + mime;
});
