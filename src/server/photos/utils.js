import crypto from 'crypto';
import fs from 'fs';

export const sha1 = (buffer) => {
  const hash = crypto.createHash('sha1');
  hash.update(buffer);
  return hash.digest('hex');
};

export const collect = stream => new Promise((resolve, reject) => {
  let buffer = Buffer.alloc(0);
  stream
    .on('data', chunk => buffer = Buffer.concat([buffer, chunk]))
    .once('error', reject)
    .once('end', () => resolve(buffer));
});

export const writeFile = (path, buffer) => new Promise((resolve, reject) => {
  fs.writeFile(path, buffer, err => {
    if (err) return reject(err);
    resolve();
  });
});

