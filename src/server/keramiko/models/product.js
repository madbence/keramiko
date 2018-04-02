const parse = row => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

export default class ProductRepository {
  constructor({db, store}) {
    this.db = db;
    this.store = store;
  }

  create(props) {
    const now = new Date();

    return this.db.transaction(async db => {
      const result = await db.query('insert into products (name, price, description, "createdAt", "updatedAt", "deletedAt") values ($1, $2, $3, $4, $5, $6) returning id', [
        props.name,
        props.price,
        props.description,
        now,
        now,
        null,
      ]);
      const id = result.rows[0].id;

      await this.store.append({
        type: 'product',
        id,
        version: 0,
        createdAt: now,
        details: {
          name: props.name,
          price: props.price,
          description: props.description,
        },
        meta: {
          event: 'created',
        },
      });

      return {
        id,
        name: props.name,
        price: props.price,
        description: props.description,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
    });
  }

  update(id, props) {
    const now = new Date();

    return this.db.transaction(async db => {
      const current = await this.getById(id);
      const fields = Object.entries(props);

      if (fields.every(([field, value]) => current[field] === value)) return current;

      const query = 'update "products" set ' + fields.map(([field,], index) => `"${field}" = $${index + 1}`).join(', ') + `, "updatedAt" = $${fields.length + 1} where id = $${fields.length + 2}`;
      await db.query(query, [
        ...fields.map(([, value]) => value),
        now,
        id,
      ]);
      const lastVersion = await this.store.getLastVersion('product', id);

      await this.store.append({
        type: 'product',
        id,
        version: lastVersion + 1,
        createdAt: now,
        details: props,
        meta: {
          event: 'updated',
        },
      });

      return this.getById(id);
    });
  }

  destroy(id) {
    const now = new Date();

    return this.db.transaction(async db => {
      const current = await this.getById(id);

      if (current.deletedAt) return;

      await db.query('update "products" set "updatedAt" = $1, "deletedAt" = $2 where id = $3', [
        now,
        now,
        id,
      ]);

      const lastVersion = await this.store.getLastVersion('product', id);
      await this.store.append({
        type: 'product',
        id,
        version: lastVersion + 1,
        createdAt: now,
        details: null,
        meta: {
          event: 'destroyed',
        },
      });
    });
  }

  async getById(id) {
    const result = await this.db.query('select * from products where id = $1', [id]);

    if (!result.rows.length) return null;
    return parse(result.rows[0]);
  }

  async list(limit, offset) {
    const result = await this.db.query('select * from products limit $1 offset $2', [limit, offset]);

    return result.rows.map(parse);
  }
}
