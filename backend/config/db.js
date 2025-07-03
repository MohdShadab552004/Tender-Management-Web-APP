import { Pool } from 'pg';
import createSchema from '../schema/schema.js';
import dotenv from 'dotenv';

dotenv.config();
console.log("📢 connectDB.js started");


const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

const connectDB = async () => {
  try {
    const client = await pool.connect();

    // 👇 yeh sab queries alag-alag chalayenge
    const statements = createSchema()
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length);

    for (let stmt of statements) {
      await client.query(stmt);
    }

    console.log('✅ Tables ban gayi!');
    client.release();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
};

export {connectDB, pool};
