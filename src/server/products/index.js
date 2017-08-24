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
    })) : undefined,
    url: row.id + '-' + slugify(row.name),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const getById = async id => {
  const res = await db.query('select p.*, json_agg(ph.*) photos from products p left join "productPhotos" pp on (pp."productId" = p.id) left join photos ph on (pp."photoId" = ph.id) where p.id = $1 group by p.id', [id]);
  return parse(res.rows[0]);
};

export const list = async () => {
  const res = await db.query('select p.*, json_agg(ph.*) photos from products p left join "productPhotos" pp on (pp."productId" = p.id) left join photos ph on (pp."photoId" = ph.id) group by p.id order by p.id asc');
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

export const addPhoto = (productId, photoId) => {
  return db.query('insert into "productPhotos" ("productId", "photoId") values ($1, $2)', [
    productId,
    photoId,
  ]);
};
