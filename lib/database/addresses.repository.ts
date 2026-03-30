import { pool } from "./connection";

export async function getAddressesByUser(userId: string): Promise<Address[]> {
  const query = `
  SELECT id, street, city, state, postal_code, country, phone, shortname, is_default 
  FROM addresses WHERE user_id = $1
  `;    
  const result = await pool.query(query, [userId]);
  return result.rows;
}