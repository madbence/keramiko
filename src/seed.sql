drop table if exists "cartEvents";
drop table if exists carts;
drop table if exists users;
drop table if exists "productTags";
drop table if exists tags;
drop table if exists "productPhotos";
drop table if exists products;
drop table if exists photos;

create table products (
  id serial primary key,
  name varchar(32) not null,
  price integer not null,
  description text not null,
  published boolean not null,
  "createdAt" timestamp not null default current_timestamp,
  "updatedAt" timestamp not null default current_timestamp,
  "deletedAt" timestamp
);

create table photos (
  id serial primary key,
  original varchar(32) not null,
  "createdAt" timestamp not null default current_timestamp
);

create table "productPhotos" (
  id serial primary key,
  "productId" int not null references products(id),
  "photoId" int not null references photos(id),
  "createdAt" timestamp not null default current_timestamp
);

create table tags (
  id serial primary key,
  name varchar(32) not null,
  createdAt timestamp not null default current_timestamp
);

create table "productTags" (
  id serial primary key,
  "productId" int not null references products(id),
  "tagId" int not null references tags(id),
  "createdAt" timestamp not null default current_timestamp
);

create table users (
  id serial primary key,
  email varchar(64) not null,
  name varchar(32),
  "createdAt" timestamp not null default current_timestamp
);

create table carts (
  id serial primary key,
  "userId" integer,
  "createdAt" timestamp not null default current_timestamp,
  "updatedAt" timestamp not null default current_timestamp
);

create table "cartEvents" (
  id serial primary key,
  "cartId" int not null references carts(id),
  type varchar(32),
  payload json,
  "createdAt" timestamp not null default current_timestamp
);
