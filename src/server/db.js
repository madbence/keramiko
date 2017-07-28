import {Client} from 'pg';

const db = new Client();
db.connect();

export default db;
