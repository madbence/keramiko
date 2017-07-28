export default async req => {
  const body = await new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    req
      .on('data', chunk => data = Buffer.concat([data, chunk]))
      .once('end', () => resolve(data));
  });
  return JSON.parse(body);
};
