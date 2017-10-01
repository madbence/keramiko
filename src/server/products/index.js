import db from '../db';

const slugify = str => str.toLowerCase().replace(/./g, char => {
  switch (char) {
    case 'ö': case 'ó': case 'ő': return 'o';
    case 'ú': case 'ü': case 'ű': return 'u';
    case 'á': return 'a';
    case 'é': return 'e';
    case 'í': return 'i';
    case ' ': return '-';
    default: return char;
  }
});

function parse(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    published: row.published,
    photos: row.photos ? row.photos.filter(Boolean).map(photo => ({
      id: photo.id,
      original: photo.original,
    })) : [],
    tags: row.tags ? row.tags.filter(Boolean) : [],
    url: row.id + '-' + slugify(row.name),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

const saveTags = async (productId, tags) => {
  const current = await db.query('select t.name, pt.id from tags t join "productTags" pt on (pt."tagId" = t.id) where pt."productId" = $1', [
    productId,
  ]);

  for (const extraTag of current.rows.filter(r => !tags.includes(r.name))) {
    await db.query('delete from "productTags" where id = $1', [
      extraTag.id,
    ]);
  }

  for (const tag of tags) {
    const existing = await db.query('select * from tags where name = $1', [tag]);
    let tagId;
    if (!existing.rows.length) {
      const res = await db.query('insert into tags (name) values ($1) returning id', [tag]);
      tagId = res.rows[0].id;
    } else tagId = existing.rows[0].id;


    const duplicate = await db.query('select * from "productTags" where "tagId" = $1 and "productId" = $2', [
      tagId,
      productId,
    ]);

    if (duplicate.rows.length) continue;
    await db.query('insert into "productTags" ("productId", "tagId") values ($1, $2)', [
      productId,
      tagId,
    ]);
  }
};

export const getById = async id => {
  const res = await db.query(`
    select
      p.*,
      (select json_agg(ph.*) from photos ph left join "productPhotos" pp on (ph.id = pp."photoId") where pp."productId" = p.id) photos,
      (select json_agg(t.name) from tags t left join "productTags" pt on (t.id = pt."tagId") where pt."productId" = p.id) tags
    from products p
    where p.id = $1
  `, [id]);

  return parse(res.rows[0]);
};

export const list = async (opts = {}) => {
  const params = [];
  const filters = [];
  const i = 1;

  for (const field of ['published']) {
    if (opts[field] == null) continue;
    filters.push(`p."${field}" = $${i}`);
    params.push(opts[field]);
  }

  const res = await db.query(`
    select
      p.*,
      (select json_agg(ph.*) from photos ph left join "productPhotos" pp on (ph.id = pp."photoId") where pp."productId" = p.id) photos,
      (select json_agg(t.name) from tags t left join "productTags" pt on (t.id = pt."tagId") where pt."productId" = p.id) tags
    from products p
      ${filters.length ? 'where ' + filters.join(' and ') : ''}
    order by id asc
  `, params);
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

  await saveTags(id, product.tags);

  return getById(id);
};

export const update = async product => {
  await db.query('update products set name = $1, price = $2, description = $3, published = $4, "updatedAt" = now() where id = $5', [
    product.name,
    product.price,
    product.description,
    product.published,
    product.id,
  ]);

  await saveTags(product.id, product.tags);

  return getById(product.id);
};

export const addPhoto = (productId, photoId) => db.query('insert into "productPhotos" ("productId", "photoId") values ($1, $2)', [
  productId,
  photoId,
]);
