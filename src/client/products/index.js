import List from './list';
import Details from './details';

import {get, post, put} from '../api';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const parse = item => ({
  id: item.id,
  name: item.name,
  price: item.price,
  description: item.description,
  tags: [],
  photos: [],
});

export const fetch = async id => {
  if (id) {
    console.log('loading product', id);
    const res = await get('/products/' + id);
    return parse(res);
  }
  console.log('loading product list');
  const items = await get('/products');
  return items.map(parse);
};

export const save = async item => {
  if (!item.id) {
    console.log('saving new product', item);
    const res = await post('/products', {
      name: item.name,
      price: item.price,
      description: item.description,
    });
    return parse(res);
  } else {
    console.log('saving existing product', item);
    const res = await put('/products/' + item.id, {
      name: item.name,
      price: item.price,
      description: item.description,
    });
    return parse(res);
  }
}

export {List, Details};
