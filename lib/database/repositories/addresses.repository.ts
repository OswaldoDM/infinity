import { pool } from "../connection";

export async function getAddressesByUser(userId: string): Promise<Address[]> {
  const query = `
  SELECT id, street, city, state, postal_code, country, phone, shortname, is_default 
  FROM addresses WHERE user_id = $1
  `;    
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function createAddress(
  userId: number,
  shortname: string,
  street: string,
  city: string,
  state: string,
  postalCode: string,
  phone: string
): Promise<Address> {
  const query = `
  INSERT INTO addresses (user_id, shortname, street, city, state, postal_code, phone, is_default)
  VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)
  RETURNING id, street, city, state, postal_code, phone, shortname, is_default
  `;
  const result = await pool.query(query, [userId, shortname, street, city, state, postalCode, phone]);
  return result.rows[0];
}

export async function updateAddress(
  addressId: number,
  shortname: string,
  street: string,
  city: string,
  state: string,
  postalCode: string,
  phone: string
): Promise<Address> {
  const query = `
  UPDATE addresses 
  SET shortname = $2, street = $3, city = $4, state = $5, postal_code = $6, phone = $7
  WHERE id = $1
  RETURNING id, street, city, state, postal_code, phone, shortname, is_default
  `;
  const result = await pool.query(query, [addressId, shortname, street, city, state, postalCode, phone]);
  return result.rows[0];
}

export async function deleteAddress(addressId: number): Promise<void> {
  const query = `DELETE FROM addresses WHERE id = $1`;
  await pool.query(query, [addressId]);
}

