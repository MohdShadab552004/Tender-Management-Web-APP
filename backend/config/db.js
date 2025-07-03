// db.js
import knex from 'knex';
import config from '../knexfile.js'; // make sure path is correct

const db = knex(config.development); // or use process.env.NODE_ENV
export default db;
