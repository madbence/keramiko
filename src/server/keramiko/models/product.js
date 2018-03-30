const parse = row => ({
  id: row.id,
  name: row.name,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  deletedAt: row.deletedAt,
});

export default class ProductRepository {
  constructor({db}) {
    this.db = db;
  }

  async getById(id) {
    const result = await this.db.query('select * from products where id = $1', [id]);

    if (!result.rows.lenth) return null;
    return parse(result.rows[0]);
  }

  async list(limit, offset) {
    const result = await this.db.query('select * from products limit $1 offset $2', [limit, offset]);

    return result.rows.map(parse);
  }
}
