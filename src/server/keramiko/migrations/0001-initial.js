const tables = [{
  name: 'users',
  fields: [
    ['id', 'serial primary key'],
    ['name', 'varchar(32) not null'],
    ['email', 'varchar(32) not null'],
    ['createdAt', 'timestamp not null default current_timestamp'],
    ['updatedAt', 'timestamp not null default current_timestamp'],
    ['deletedAt', 'timestamp'],
  ],
}, {
  name: 'products',
  fields: [
    ['id', 'serial primary key'],
    ['name', 'varchar(32) not null'],
    ['price', 'integer not null'],
    ['description', 'text not null'],
    ['createdAt', 'timestamp not null default current_timestamp'],
    ['updatedAt', 'timestamp not null default current_timestamp'],
    ['deletedAt', 'timestamp'],
  ],
}, {
  name: 'events',
  fields: [
    ['id', 'serial primary key'],
    ['type', 'varchar(32)'],
    ['details', 'json not null'],
    ['userId', 'int not null references users(id)'],
    ['createdAt', 'timestamp not null default current_timestamp'],
  ],
}];

export async function up({db}) {
  for (const table of tables) {
    await db.query(`create table "${table.name}" (${table.fields.map(([name, details]) => `"${name}" ${details}`).join(', ')})`);
  }

  await db.query('insert into users (name, email) values ($1, $2)', [
    'System',
    'admin@keramiko.eu',
  ]);
}

export async function down({db}) {
  for (const table of tables.reverse()) {
    await db.query(`drop table "${table.name}"`);
  }
}
