import assert from 'assert';
import ProductRepository from './product';

describe('ProductRepository', function () {
  let rows;
  beforeEach(function () {
    this.products = new ProductRepository({
      db: {
        query: () => Promise.resolve({rows}),
      },
    });
  });

  describe('getById', function () {
    it('should return a result when found', async function () {
      rows = [{id: 1}];
      const result = await this.products.getById(1);
      assert.equal(result.id, 1);
    });
    it('should return null when not found', async function () {
      rows = [];
      const result = await this.products.getById(1);
      assert.equal(result, null);
    })
  });

  describe('list', function () {
    it('should return a list', async function () {
      rows = [{id: 1}, {id: 2}];
      const result = await this.products.list(10, 0);
      assert.equal(result.length, 2);
    });
  });
});
