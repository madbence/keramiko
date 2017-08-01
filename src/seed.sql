drop table if exists products;

create table products (
  id serial primary key,
  name varchar(32) not null,
  price integer not null,
  description text not null,
  published boolean not null,
  "createdAt" timestamp not null default current_timestamp,
  "updatedAt" timestamp not null default current_timestamp
);
