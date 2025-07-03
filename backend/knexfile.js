// knexfile.js
export default {
  development: {
    client: 'pg',
    connection: 'postgresql://postgres:Shad%40b567@db.jylijpgmubfatdaiiwwj.supabase.co:5432/postgres',
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    ssl: { rejectUnauthorized: false }, 
  }
};
