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
}

export {EventRepository};
