import db from '../db';

const replay = (events, cart) => {
  for (const event of events) {
    let product;
    switch (event.type) {
      case 'init':
        cart = {
          id: event.cartId,
          products: [],
          userId: null,
          createdAt: event.createdAt,
        };
        break;
      case 'add':
        if (!cart) throw new Error('No cart was created!');
        product = cart.products.find(product => product.id === event.payload.id);
        if (product) product.quantity += event.payload.quantity;
        else {
          cart.products.push({
            id: event.payload.id,
            quantity: event.payload.quantity,
          });
        }
        break;
      case 'remove':
        if (!cart) throw new Error('No cart was created!');
        product = cart.products.find(product => product.id === event.payload.id);
        if (!product) break;
        product.quantity -= event.payload.quantity;
        if (product.quantity <= 0) cart.products.splice(cart.products.indexOf(product), 1);
        break;
      default:
        throw new Error('Unknown event type: ' + event.type + '!');
    }

    cart.updatedAt = event.createdAt;
  }

  return cart;
};

export const getById = async id => {
  const res = await db.query('select * from "cartEvents" where "cartId" = $1 order by id asc', [
    id,
  ]);

  return replay(res.rows, null);
};

export const create = async () => {
  const res = await db.query('insert into carts default values returning id');
  const id = res.rows[0].id;

  await db.query('insert into "cartEvents" ("cartId", type, payload) values ($1, $2, $3)', [
    id,
    'init',
    null,
  ]);

  return getById(id);
};

export const add = async (cartId, productId, quantity) => {
  await db.query('insert into "cartEvents" ("cartId", type, payload) values ($1, $2, $3)', [
    cartId,
    'add',
    {id: productId, quantity},
  ]);

  return getById(cartId);
};

export const remove = async (cartId, productId, quantity) => {
  await db.query('insert into "cartEvents" ("cartId", type, payload) values ($1, $2, $3)', [
    cartId,
    'remove',
    {id: productId, quantity},
  ]);

  return getById(cartId);
};
