import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "db.ayvouzycmojxlbcxhquy.supabase.co",
  database: "postgres",
  password: "AYD1_G8_1S2025",
  port: 5432, 
});

export const connectPg= async() =>{
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL:", res.rows);
    client.release();
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}