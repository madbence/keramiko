import List from './list';
import Details from './details';

const products = [{
  id: 1,
  name: 'Almasütő',
  description: 'Lorem ipsum',
  price: 3500,
  tags: ['alma', 'sütő']
}];

for (let i = 0; i < 9; i++) {
  products.push(products[0]);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetch = async () => {
  await sleep(1000);
  return products;
};

export {List, Details};
