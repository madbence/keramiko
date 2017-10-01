import upload from './upload';
import db from '../db';

const parse = row => ({
  id: row.id,
  original: row.original,
});

const parseFirst = sql => async param => {
  const res = await db.query(sql, [param]);

  if (res.rows[0]) return parse(res.rows[0]);


  return null;
};

export const getByName = parseFirst('select * from photos where original = $1');
export const getById = parseFirst('select * from photos where id = $1');

export {upload};
