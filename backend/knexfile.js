// knexfile.js
export default {
  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    ssl: { rejectUnauthorized: false }, 
  }
};
