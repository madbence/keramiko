export default (domain, middlewares) => async (ctx, next) => {
  if (ctx.subdomains[0] === domain) {
    return middlewares(ctx, next);
  }
  return next();
};
