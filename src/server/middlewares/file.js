import fs from 'fs';
import {get} from 'koa-route';

export default (url, path, type) => get(url, async ctx => {
  const buffer = await new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });

  ctx.body = buffer;
  ctx.type = type;
});
