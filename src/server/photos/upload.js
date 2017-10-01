import {join} from 'path';
import {sha1, collect, writeFile} from './utils';
import resize from './resize';
import db from '../db';
import config from '../config';
import {getByName, getById} from './';

export default async function upload(stream, type) {
  const buffer = await collect(stream);
  const hash = await sha1(buffer);
  const name = hash.slice(0, 6) + '.' + type;

  await new Promise(resolve => setTimeout(resolve, 2000));

  const existing = await getByName(name);

  if (existing) return existing;


  const path = join(config.uploadDir, name);

  await writeFile(path, buffer);

  const sizes = await Promise.all([
    resize(path, 1000),
    resize(path, 500),
    resize(path, 250),
    resize(path, 100),
  ]);

  const res = await db.query('insert into photos (original) values ($1) returning id', [
    name,
  ]);

  return getById(res.rows[0].id);
}
