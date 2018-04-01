import Client from 'common/db/client';

export default class PoolClient extends Client {
  release() {
    this.client.release();
  }
}
