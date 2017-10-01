import compose from 'koa-compose';
import {get, post} from 'koa-route';
import {renderFile} from 'pug';
import serve from '../middlewares/file';
import * as products from '../products';
import config from '../config';
import menu from '../../client/icons/menu';
import cart from '../../client/icons/cart';
import trash from '../../client/icons/trash';
import * as jwt from '../utils/jwt';
import * as carts from '../cart';
import json from '../utils/json';
import nodemailer from 'nodemailer';
import fs from 'fs';

const mailer = nodemailer.createTransport({
  host: config.smtp.host,
  port: 587,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
  dkim: {
    domainName: config.dkim.domain,
    keySelector: config.dkim.selector,
    privateKey: fs.readFileSync(config.dkim.privateKey).toString(),
  },
});

const icons = {cart, menu, trash};

const format = n => n.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1 ').split('').reverse().join('') + ' Ft';

async function session(ctx, next) {
  let cookie = ctx.cookies.get('session');
  if (!cookie) {
    cookie = await jwt.sign({cartId: null}, process.env.SECRET);
    ctx.cookies.set('session', cookie);
  }

  try {
    ctx.session = await jwt.verify(cookie, process.env.SECRET);
    const cartId = ctx.session.cartId;
    await next();
    if (ctx.session.cartId !== cartId) {
      cookie = await jwt.sign({cartId: ctx.session.cartId}, process.env.SECRET);
      ctx.cookies.set('session', cookie);
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      err.statusCode = 403;
    }
    throw err;
  }
}

export default compose([
  serve('/bundle.css', './public/store.css', 'text/css'),

  session,

  (ctx, next) => {
    ctx.render = (file, locals) => {
      ctx.body = renderFile(file, {
        config,
        icons,
        ...locals,
      });
    };
    return next();
  },

  post('/cart/add', async ctx => {
    const body = await json(ctx.req);

    let cartId = ctx.session.cartId;
    if (cartId) {
      const cart = await carts.getById(cartId);
      if (!cart) throw new Error('Cart not found!');
    } else {
      const cart = await carts.create();
      ctx.session.cartId = cartId = cart.id;
    }

    const productId = body.productId;
    const product = await products.getById(productId);

    if (!product) throw new Error('Product not found!');

    const cart = await carts.add(cartId, productId, body.quantity);
    cart.products = await Promise.all(cart.products.map(async ({id, quantity}) => {
      const product = await products.getById(id);
      return {
        ...product,
        quantity,
      };
    }));
    ctx.render('./src/server/store/cart.pug', {
      cart: cart.products,
    });
  }),

  post('/cart/remove', async ctx => {
    const body = await json(ctx.req);

    const cartId = ctx.session.cartId;
    if (!cartId) {
      ctx.render('./src/server/store/cart.pug', {
        cart: [],
      });
      return;
    }

    let cart = await carts.getById(cartId);

    if (!cart) throw new Error('Cart not found!');

    const productId = body.productId;
    const product = await products.getById(productId);

    if (!product) throw new Error('Product not found!');

    cart = await carts.remove(cartId, productId, body.quantity);

    cart.products = await Promise.all(cart.products.map(async ({id, quantity}) => {
      const product = await products.getById(id);
      return {
        ...product,
        quantity,
      };
    }));

    ctx.render('./src/server/store/cart.pug', {
      cart: cart.products,
    });
  }),

  post('/orders', async ctx => {
    const body = await json(ctx.req);
    const cartId = ctx.session.cartId;
    if (!cartId) throw new Error('Cart is empty');
    const cart = await carts.getById(cartId);
    if (!cart) throw new Error('Cart is empty!');
    cart.products = await Promise.all(cart.products.map(async ({id, quantity}) => {
      const product = await products.getById(id);
      return {
        ...product,
        quantity,
      };
    }));

    await new Promise((resolve, reject) => {
      mailer.sendMail({
        from: config.smtp.from,
        to: body.email,
        subject: 'Keramiko rendelés',
        html: `<html>
  <body>
    <h1>Kedves ${body.email}!</h1>
    <p>Köszönöm, hogy az én boltomból választottál!<p>
    <p>A megrendelésed az alábbi termékeket tartalmazza:</p>
    <ul>
      ${cart.products.map(item => `<li>${item.quantity}db ${item.name} (${item.quantity * item.price} Ft)</li>`).join('\n      ')}
    </ul>
    <p>Végösszeg: ${cart.products.reduce((sum, item) => sum + item.quantity * item.price, 0)} Ft</p>
    <p>A megrendelésről tőlem is fogsz kapni egy megerősítő emailt, ebben tudok pontosabbat mondani a rendelés várható elkészülési idejéről</p>
    <p><br />Üdv, Bedő Anikó</p>
  </body>
</html>`,
      }, (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      });
    });

    await new Promise((resolve, reject) => {
      mailer.sendMail({
        from: config.smtp.from,
        to: config.admin.email,
        subject: 'Keramiko rendelés: ' + body.email,
        html: `<html>
  <body>
    <h1>Új megrendelés: ${body.email}</h1>
    <p>A megrendelés az alábbi termékeket tartalmazza:</p>
    <ul>
      ${cart.products.map(item => `<li>${item.quantity}db ${item.name} (${item.quantity * item.price} Ft)</li>`).join('\n      ')}
    </ul>
    <p>Végösszeg: ${cart.products.reduce((sum, item) => sum + item.quantity * item.price, 0)} Ft</p>
  </body>
</html>`,
      }, (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      });
    });

    ctx.body = {ok: true};
    ctx.session.cartId = null;
  }),

  get('/products/:id-*', async (ctx, id) => {
    const product = await products.getById(+id);
    let cart = null;
    if (ctx.session.cartId) cart = await carts.getById(ctx.session.cartId);
    if (cart) {
      cart.products = await Promise.all(cart.products.map(async ({id, quantity}) => {
        const product = await products.getById(id);
        return {
          ...product,
          quantity,
        };
      }));
    }

    if (!product) return;

    ctx.render('./src/server/store/product.pug', {
      product: {
        id: product.id,
        name: product.name,
        price: format(product.price),
        preview: product.photos && product.photos[0] ? config.cdn + '/' + product.photos[0].original : 'http://placehold.it/180x240',
        description: product.description,
      },
      cart: cart ? cart.products : [],
    });
  }),

  get('/', async ctx => {
    const list = await products.list({
      published: true,
    });

    let cart = null;
    if (ctx.session.cartId) cart = await carts.getById(ctx.session.cartId);
    if (cart) {
      cart.products = await Promise.all(cart.products.map(async ({id, quantity}) => {
        const product = await products.getById(id);
        return {
          ...product,
          quantity,
        };
      }));
    }

    ctx.render('./src/server/store/home.pug', {
      products: list.map(item => ({
        name: item.name,
        price: format(item.price),
        thumbnail: item.photos && item.photos[0] ? config.cdn + '/' + item.photos[0].original : 'http://placehold.it/180x240',
        url: item.url,
      })),
      cart: cart ? cart.products : [],
    });
  }),
]);
