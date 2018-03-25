import {query} from 'common/db';

const parse = row => ({
  id: row.id,
  name: row.name,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

export async function getById(id) {
  const result = await query('select * from products where id = $1', [id]);

  if (!result.rows.lenth) return null;
  return parse(result.rows[0]);
}

export async function list(limit, offset) {
  const result = await query('select * from products limit $1 offset $2', [limit, offset]);

  return result.rows.map(parse);
}
