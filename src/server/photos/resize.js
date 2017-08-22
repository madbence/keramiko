import {spawn} from 'child_process';
import fs from 'fs';
import {dirname, extname, join} from 'path';
import {collect, sha1, writeFile} from './utils';

export default async (file, width) => {
  const dir = dirname(file);
  const type = extname(file);

  const convert = spawn('convert', [
    '-',
    '-strip',
    '-quality', '85%',
    '-resize', width,
    '-',
  ]);

  fs.createReadStream(file).pipe(convert.stdin);

  const buffer = await collect(convert.stdout);
  const hash = await sha1(buffer);
  const name = hash.slice(0, 6) + type;

  await writeFile(join(dir, name), buffer);

  return name;
}
