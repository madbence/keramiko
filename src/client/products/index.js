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
  photos: [],
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
  if (!item.id) {
    const res = await post('/products', {
      name: item.name,
      price: item.price,
      description: item.description,
      published: item.published,
    });
    return parse(res);
  } else {
    const res = await put('/products/' + item.id, {
      name: item.name,
      price: item.price,
      description: item.description,
      published: item.published,
    });
    return parse(res);
  }
}

export {List, Details};
