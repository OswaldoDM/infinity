import { pool } from "../connection";

type CreateUserData = Pick<User, 'username' | 'email' | 'password_hash'>;

export async function findUserByEmail(email: string): Promise<User | null> {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

export async function findUserById(id: number): Promise<User | null> {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  const { username, email, password_hash } = userData;
  const query = `
    INSERT INTO users (username, email, password_hash) 
    VALUES ($1, $2, $3) 
    RETURNING id, username, email, role, created_at
  `;
  const result = await pool.query(query, [username, email, password_hash]);
  return result.rows[0];
}

export async function updateUserImage(userId: number, imageUrl: string): Promise<User> {
  const query = `
    UPDATE users 
    SET image_url = $1 
    WHERE id = $2 
    RETURNING id, username, email, image_url, role, created_at
  `;
  const result = await pool.query(query, [imageUrl, userId]);
  return result.rows[0];
}
