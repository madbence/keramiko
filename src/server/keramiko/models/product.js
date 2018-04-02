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

  async generateId() {
    const result = await this.db.query('select nextval($1) as id', ['products_id_seq']);
    return result.rows[0].id;
  }

  async create(props) {
    const id = await this.generateId();
    const now = new Date();

    await this.db.transaction(async db => {
      await db.query('insert into products (id, name, price, description, "createdAt", "updatedAt", "deletedAt") values ($1, $2, $3, $4, $5, $6, $7)', [
        id,
        props.name,
        props.price,
        props.description,
        now,
        now,
        null,
      ]);

      await this.store.append({
        type: 'product',
        id,
        version: 0,
        createdAt: now,
        details: {
          id,
          name: props.name,
          price: props.price,
          description: props.description,
        },
        meta: {
          event: 'created',
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
