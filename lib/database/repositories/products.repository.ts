
import { pool } from "../connection";

export async function getProducts(): Promise<Product[]> {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.stock_quantity, 
      p.image_url, 
      p.category_id,
      p.created_at,
      p.updated_at,
      c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;  
  const result = await pool.query(query);
  return result.rows;
}

/*
Para getProductById usar p.* es aceptable porque solo estás trayendo 
una sola fila (la que coincida con el id), así no tendras el impacto de 
traer columnas extra.
*/
export async function getProductById(id: number): Promise<Product | null> {
  const query = `
    SELECT 
      p.*, 
      c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}
