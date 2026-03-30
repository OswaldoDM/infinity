import { pool } from "./connection";

export async function getCategories(): Promise<Category[]> {
  const query = `SELECT id, name FROM categories`;    
  const result = await pool.query(query);
  return result.rows;
}