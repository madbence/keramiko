const tables = [{
  name: 'events',
  fields: [
    ['id', 'serial primary key'],
    ['aggregateType', 'varchar(32)'],
    ['aggregateId', 'int not null'],
    ['version', 'int not null'],
    ['details', 'json not null'],
    ['meta', 'json not null'],
    ['createdAt', 'timestamp not null'],
  ],
}, {
  name: 'products',
  fields: [
    ['id', 'serial primary key'],
    ['name', 'varchar(64) not null'],
    ['description', 'text'],
    ['price', 'int not null'],
    ['createdAt', 'timestamp not null'],
    ['updatedAt', 'timestamp not null'],
    ['deletedAt', 'timestamp'],
  ],
}];

export async function up({db}) {
  for (const table of tables) {
    await db.query(`create table "${table.name}" (${table.fields.map(([name, details]) => `"${name}" ${details}`).join(', ')})`);
  }
}

export async function down({db}) {
  for (const table of tables.reverse()) {
    await db.query(`drop table "${table.name}"`);
  }
}
