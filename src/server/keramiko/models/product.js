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
      const fields = Object.entries(props);
      const query = 'update "products" set ' + fields.map((entry, index) => `"${entry[0]}" = $${index + 1}`).join(', ') + `, "updatedAt" = $${fields.length + 1} where id = $${fields.length + 2}`;
      const result = await db.query(query, [
        ...fields.map(([field, value]) => value),
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
