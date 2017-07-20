import List from './list';
import Details from './details';

const products = [{
  id: 1,
  name: 'Almasütő',
  description: 'Lorem ipsum',
  price: 3500,
  tags: ['alma', 'sütő']
}];

for (let i = 0; i < 18; i++) {
  products.push({
    ...products[0],
    id: i + 2,
  });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetch = async () => {
  await sleep(1000);
  return products;
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
