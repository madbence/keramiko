import List from './list';
import Details from './details';

import {get, post, put} from '../api';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const parse = item => ({
  id: item.id,
  name: item.name,
  price: item.price,
  description: item.description,
  published: item.published,
  tags: [],
  photos: item.photos,
});

export const fetch = async id => {
  if (id) {
    const res = await get('/products/' + id);
    return parse(res);
  }
  const items = await get('/products');
  return items.map(parse);
};

export const save = async item => {
  let res;
  if (!item.id) {
    res = await post('/products', {
      name: item.name,
      price: item.price,
      description: item.description,
      published: item.published,
    });
  } else {
    res = await put('/products/' + item.id, {
      name: item.name,
      price: item.price,
      description: item.description,
      published: item.published,
    });
  }

  return parse(res);
}

export const addPhoto = async (item, photo) => {
  await post('/products/' + item.id + '/photos', {
    photoId: photo.id,
  });
};

export {List, Details};
