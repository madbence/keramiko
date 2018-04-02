class EventRepository {
  constructor({db}) {
    this.db = db;
  }

  append({type, id, version, createdAt, details, meta}) {
    return this.db.query('insert into events ("aggregateType", "aggregateId", "details", "meta", "createdAt", "version") values ($1, $2, $3, $4, $5, $6)', [
      type,
      id,
      details,
      meta,
      createdAt,
      version,
    ]);
  }

  async getLastVersion(type, id) {
    const result = await this.db.query('select version from events where "aggregateType" = $1 and "aggregateId" = $2 order by version desc limit 1', [type, id]);

    if (!result.rows[0]) throw new Error(`No existing version found for ${type}:${id}`);
    return result.rows[0].version;
  }
}

export {EventRepository};
