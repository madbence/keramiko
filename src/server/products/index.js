import db from '../db';

function parse(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    published: row.published,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const getById = async id => {
  const res = await db.query('select * from products where id = $1', [id]);
  return parse(res.rows[0]);
};

export const list = async () => {
  const res = await db.query('select * from products order by id asc');
  return res.rows.map(parse);
};

export const create = async product => {
  const res = await db.query('insert into products (name, price, description, published) values ($1, $2, $3, $4) returning id', [
    product.name,
    product.price,
    product.description,
    product.published,
  ]);
  const id = res.rows[0].id;

  return getById(id);
}

export const update = async product => {
  await db.query('update products set name = $1, price = $2, description = $3, published = $4, "updatedAt" = now() where id = $5', [
    product.name,
    product.price,
    product.description,
    product.published,
    product.id,
  ]);

  return getById(product.id);
}
