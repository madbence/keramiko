import crypto from 'crypto';
import fs from 'fs';
import {join} from 'path';

const dir = process.env.UPLOAD_DIR;

if (!dir) {
  throw new Error('Missing UPLOAD_DIR!');
}

const writeFile = (path, buffer) => new Promise((resolve, reject) => {
  fs.writeFile(path, buffer, err => {
    if (err) return reject(err);
    resolve();
  });
});

function sha1(buffer) {
  const hash = crypto.createHash('sha1');
  hash.update(buffer);
  return hash.digest('hex');
}

function collect(stream) {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    stream
      .on('data', chunk => buffer = Buffer.concat([buffer, chunk]))
      .once('error', reject)
      .once('end', () => resolve(buffer));
  });
}

export default async function upload(stream, type) {
  const buffer = await collect(stream);
  const hash = await sha1(buffer);
  const name = hash.slice(0, 6) + '.' + type;
  await writeFile(join(dir, name), buffer);
  return {
    hash,
    type,
    name,
  };
}
