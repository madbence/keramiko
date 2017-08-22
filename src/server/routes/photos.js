import Busboy from 'busboy';
import * as photos from '../photos';

export const upload = async ctx => {
  const bus = new Busboy({headers: ctx.req.headers});

  const file = await new Promise(resolve => {
    bus.on('file', async (field, stream, name, encoding, type) => {
      switch (type) {
        case 'image/png': type = 'png'; break;
        case 'image/jpeg': type = 'jpg'; break;
        default: throw new Error(`Type '${type}' not supported!`);
      }

      resolve(await photos.upload(stream, type));
    });
    ctx.req.pipe(bus);
  });

  if (!bus._finished) {
    await new Promise(resolve => bus.once('finish', resolve));
  }

  ctx.body = file;
};
