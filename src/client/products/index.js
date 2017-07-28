import List from './list';
import Details from './details';

const api = async path => {
  const res = await window.fetch(path);
  return res.json();
}

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
    const res = await api('/api/v1/products/' + id);
    return parse(res);
  }
  const items = await api('/api/v1/products');
  return items.map(parse);
};

export const save = async item => {
  console.log('saving', item);
  if (!item.id) {
    item.id = products.length + 1;
    await sleep(1000);
    products.push(item);
    return item;
  } else {
    const stored = products.find(p => p.id === item.id);
    await sleep(1000);
    Object.assign(stored, item);
    return item;
  }
}

export {List, Details};
