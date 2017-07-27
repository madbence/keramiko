export default async (ctx, next) => {
  const body = await new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    ctx.req
      .on('data', chunk => data = Buffer.concat([data, chunk]))
      .once('end', () => resolve(data));
  });
  ctx.request.body = JSON.parse(body);
  return next();
}
