import {get} from 'koa-route';

export default get('/*', ctx => {
  ctx.body = 'Hello world!';
});
