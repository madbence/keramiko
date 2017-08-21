import {join} from 'path';
import {sha1, collect, writeFile} from './utils';
import resize from './resize';
import db from '../db';

const dir = process.env.UPLOAD_DIR;

if (!dir) {
  throw new Error('Missing UPLOAD_DIR!');
}

export default async function upload(stream, type) {
  const buffer = await collect(stream);
  const hash = await sha1(buffer);
  const name = hash.slice(0, 6) + '.' + type;
  const path = join(dir, name);

  await writeFile(path, buffer);

  const sizes = await Promise.all([
    resize(path, 1000),
    resize(path, 500),
    resize(path, 250),
    resize(path, 100),
  ]);

  const res = await db.query('insert into images (original) values ($1) returning id', [
    name,
  ]);

  return {
    id: res.rows[0].id,
    hash,
    type,
    name,
    sizes,
  };
}
